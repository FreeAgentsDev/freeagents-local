"use server";

import { headers } from "next/headers";

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

const completeRegistrationSchema = z.object({
  business: z.string().min(2).max(120),
  city: z.string().min(2).max(80),
  whatsapp: z.string().min(7).max(20),
  snapshot: z
    .object({
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
    })
    .nullable(),
});

export type CompleteRegistrationInput = z.infer<
  typeof completeRegistrationSchema
>;

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

  const existing = await getUserOrganization(session.user.id);
  if (existing) {
    // Already registered (e.g. retry after a partial failure): nothing to do.
    return { ok: true };
  }

  const { business, city, whatsapp, snapshot } = parsed.data;

  const businessType = snapshot
    ? sanitizeBusinessType(snapshot.businessType)
    : null;
  const goals = snapshot ? sanitizeGoals(snapshot.goals) : [];
  const solutions = snapshot ? sanitizeSolutions(snapshot.solutions) : [];
  const metrics: BusinessMetrics = snapshot
    ? {
        monthlyClientsRange:
          (snapshot.metrics.monthlyClientsRange as BusinessMetrics["monthlyClientsRange"]) ??
          null,
        averageTicket: snapshot.metrics.averageTicket,
        weeklyAdminHoursRange:
          (snapshot.metrics.weeklyAdminHoursRange as BusinessMetrics["weeklyAdminHoursRange"]) ??
          null,
        hourlyValue: snapshot.metrics.hourlyValue,
      }
    : { ...EMPTY_METRICS };

  // Pricing is always recomputed server-side from the catalog source of truth.
  const result = calculateSolution({
    businessType,
    selectedGoals: goals,
    selectedSolutions: solutions,
    metrics,
  });

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
            businessType,
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

    if (solutions.length > 0) {
      const [quote] = await tx
        .insert(catalogQuotes)
        .values({
          organizationId: created.id,
          snapshot: {
            businessType,
            goals,
            solutions,
            metrics,
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
          sourceCta: snapshot?.sourceCta ?? "register",
        })
        .returning({ id: catalogQuotes.id });

      for (const solutionId of solutions) {
        const productModule = getProductModule(solutionId);
        const status = await productModule.provision();

        const [entitlement] = await tx
          .insert(entitlements)
          .values({
            organizationId: created.id,
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
    }

    return created.id;
  });

  void notifyCrm("client_registered", {
    organizationId,
    business,
    city,
    whatsapp,
    email: session.user.email,
    name: session.user.name,
    solutions,
    setupPrice: result.setupPrice,
    monthlyPrice: result.monthlyPrice,
  });

  return { ok: true };
}
