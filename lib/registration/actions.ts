"use server";

import { headers } from "next/headers";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth/auth";
import { calculateSolution } from "@/lib/local-catalog/calculate-solution";
import { EMPTY_METRICS } from "@/lib/local-catalog/data/metrics";
import type {
  BusinessMetrics,
  BusinessTypeId,
  GoalId,
  SolutionId,
} from "@/lib/local-catalog/types";
import { notifyCrm } from "@/lib/crm/webhook";
import { db } from "@/lib/db";
import {
  catalogQuotes,
  entitlements,
  onboardingItems,
  organizationMembers,
  organizations,
} from "@/lib/db/schema";
import { getUserOrganization } from "@/lib/auth/session";
import { getProductModule, isProductId } from "@/lib/products/registry";
import { BUSINESS_TYPES } from "@/lib/local-catalog/data/business-types";
import { GOALS } from "@/lib/local-catalog/data/goals";

const snapshotSchema = z.object({
  businessType: z.string().nullable(),
  goals: z.array(z.string()),
  solutions: z.array(z.string()),
  metrics: z.object({
    monthlyClientsRange: z.string().nullable(),
    averageTicket: z.number().nullable(),
    weeklyAdminHoursRange: z.string().nullable(),
    hourlyValue: z.number().nullable(),
  }),
  sourceCta: z.string(),
});

const completeRegistrationSchema = z.object({
  business: z.string().min(2).max(120),
  city: z.string().min(2).max(80),
  whatsapp: z.string().min(7).max(20),
  snapshot: snapshotSchema.nullable(),
});

export type CompleteRegistrationInput = z.infer<
  typeof completeRegistrationSchema
>;

export type CatalogSnapshotInput = z.infer<typeof snapshotSchema>;

type SanitizedSnapshot = {
  businessType: BusinessTypeId | null;
  goals: GoalId[];
  solutions: SolutionId[];
  metrics: BusinessMetrics;
  sourceCta: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function sanitizeBusinessType(value: string | null): BusinessTypeId | null {
  return BUSINESS_TYPES.some((type) => type.id === value)
    ? (value as BusinessTypeId)
    : null;
}

function sanitizeGoals(values: string[]): GoalId[] {
  return values.filter((value): value is GoalId =>
    GOALS.some((goal) => goal.id === value),
  );
}

function sanitizeSolutions(values: string[]): SolutionId[] {
  return values.filter((value): value is SolutionId => isProductId(value));
}

function sanitizeSnapshot(
  snapshot: CatalogSnapshotInput | null,
): SanitizedSnapshot {
  if (!snapshot) {
    return {
      businessType: null,
      goals: [],
      solutions: [],
      metrics: { ...EMPTY_METRICS },
      sourceCta: "register",
    };
  }

  return {
    businessType: sanitizeBusinessType(snapshot.businessType),
    goals: sanitizeGoals(snapshot.goals),
    solutions: sanitizeSolutions(snapshot.solutions),
    metrics: {
      monthlyClientsRange:
        (snapshot.metrics.monthlyClientsRange as BusinessMetrics["monthlyClientsRange"]) ??
        null,
      averageTicket: snapshot.metrics.averageTicket,
      weeklyAdminHoursRange:
        (snapshot.metrics.weeklyAdminHoursRange as BusinessMetrics["weeklyAdminHoursRange"]) ??
        null,
      hourlyValue: snapshot.metrics.hourlyValue,
    },
    sourceCta: snapshot.sourceCta || "register",
  };
}

type QueryClient = {
  insert: typeof db.insert;
  select: typeof db.select;
};

async function provisionSolutions(
  tx: QueryClient,
  organizationId: string,
  snapshot: SanitizedSnapshot,
) {
  const result = calculateSolution({
    businessType: snapshot.businessType,
    selectedGoals: snapshot.goals,
    selectedSolutions: snapshot.solutions,
    metrics: snapshot.metrics,
  });

  if (snapshot.solutions.length === 0) {
    return { added: 0, result };
  }

  const existing = await tx
    .select({ productId: entitlements.productId })
    .from(entitlements)
    .where(eq(entitlements.organizationId, organizationId));
  const alreadyHave = new Set(existing.map((row) => row.productId));
  const toAdd = snapshot.solutions.filter((id) => !alreadyHave.has(id));

  if (toAdd.length === 0) {
    return { added: 0, result };
  }

  const [quote] = await tx
    .insert(catalogQuotes)
    .values({
      organizationId,
      snapshot: {
        businessType: snapshot.businessType,
        goals: snapshot.goals,
        solutions: snapshot.solutions,
        metrics: snapshot.metrics,
        estimates: {
          recoverableRevenue: result.impact.recoverableRevenue,
          timeValuePerMonth: result.impact.timeValuePerMonth,
          paybackMonths: result.paybackMonths,
        },
      },
      setupPrice: result.setupPrice,
      monthlyPrice: result.monthlyPrice,
      isSetupFrom: result.isSetupFrom,
      isMonthlyFrom: result.isMonthlyFrom,
      sourceCta: snapshot.sourceCta,
    })
    .returning({ id: catalogQuotes.id });

  for (const solutionId of toAdd) {
    const productModule = getProductModule(solutionId);
    const status = await productModule.provision();

    const [entitlement] = await tx
      .insert(entitlements)
      .values({
        organizationId,
        productId: solutionId,
        status,
        quoteId: quote.id,
      })
      .returning({ id: entitlements.id });

    if (productModule.product.onboarding.length > 0) {
      await tx.insert(onboardingItems).values(
        productModule.product.onboarding.map((title, index) => ({
          entitlementId: entitlement.id,
          title,
          position: index,
        })),
      );
    }
  }

  return { added: toAdd.length, result };
}

export async function applyCatalogSnapshot(input: {
  snapshot: CatalogSnapshotInput;
}): Promise<
  | { ok: true; added: number }
  | { ok: false; error: string; code?: "NO_SESSION" | "NO_ORG" }
> {
  const parsed = snapshotSchema.safeParse(input.snapshot);
  if (!parsed.success) {
    return { ok: false, error: "La solución no es válida. Ármala de nuevo en el catálogo." };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      ok: false,
      error: "Inicia sesión para activar esta solución.",
      code: "NO_SESSION",
    };
  }

  const membership = await getUserOrganization(session.user.id);
  if (!membership) {
    return {
      ok: false,
      error: "Termina de crear tu negocio para activar la solución.",
      code: "NO_ORG",
    };
  }

  const snapshot = sanitizeSnapshot(parsed.data);
  if (snapshot.solutions.length === 0) {
    return {
      ok: false,
      error: "Selecciona al menos una solución en el catálogo.",
    };
  }

  const { added, result } = await db.transaction(async (tx) =>
    provisionSolutions(tx, membership.organization.id, snapshot),
  );

  if (added > 0) {
    void notifyCrm("client_registered", {
      organizationId: membership.organization.id,
      business: membership.organization.name,
      city: membership.organization.city,
      whatsapp: membership.organization.whatsapp,
      email: session.user.email,
      name: session.user.name,
      solutions: snapshot.solutions,
      setupPrice: result.setupPrice,
      monthlyPrice: result.monthlyPrice,
    });
  }

  return { ok: true, added };
}

export async function completeRegistration(
  input: CompleteRegistrationInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = completeRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Datos inválidos. Revisa el formulario." };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { ok: false, error: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const snapshot = sanitizeSnapshot(parsed.data.snapshot);
  const result = calculateSolution({
    businessType: snapshot.businessType,
    selectedGoals: snapshot.goals,
    selectedSolutions: snapshot.solutions,
    metrics: snapshot.metrics,
  });

  const existing = await getUserOrganization(session.user.id);
  if (existing) {
    if (snapshot.solutions.length > 0) {
      await db.transaction(async (tx) =>
        provisionSolutions(tx, existing.organization.id, snapshot),
      );
    }
    return { ok: true };
  }

  const { business, city, whatsapp } = parsed.data;
  const baseSlug = slugify(business) || "negocio";

  const organizationId = await db.transaction(async (tx) => {
    let slug = baseSlug;
    let attempt = 0;
    let created: { id: string } | undefined;

    while (!created) {
      try {
        const [row] = await tx
          .insert(organizations)
          .values({
            name: business,
            slug,
            businessType: snapshot.businessType,
            city,
            whatsapp,
          })
          .returning({ id: organizations.id });
        created = row;
      } catch (error) {
        attempt += 1;
        if (attempt > 3) {
          throw error;
        }
        slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
      }
    }

    await tx.insert(organizationMembers).values({
      organizationId: created.id,
      userId: session.user.id,
      role: "owner",
    });

    await provisionSolutions(tx, created.id, snapshot);

    return created.id;
  });

  void notifyCrm("client_registered", {
    organizationId,
    business,
    city,
    whatsapp,
    email: session.user.email,
    name: session.user.name,
    solutions: snapshot.solutions,
    setupPrice: result.setupPrice,
    monthlyPrice: result.monthlyPrice,
  });

  return { ok: true };
}
