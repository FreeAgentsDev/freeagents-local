import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  catalogQuotes,
  entitlements,
  onboardingItems,
  organizationMembers,
  user,
} from "@/lib/db/schema";

export async function getOrganizationEntitlements(organizationId: string) {
  return db
    .select()
    .from(entitlements)
    .where(eq(entitlements.organizationId, organizationId))
    .orderBy(asc(entitlements.createdAt));
}

export async function getLatestQuote(organizationId: string) {
  const rows = await db
    .select()
    .from(catalogQuotes)
    .where(eq(catalogQuotes.organizationId, organizationId))
    .orderBy(desc(catalogQuotes.createdAt))
    .limit(1);
  return rows[0] ?? null;
}

export async function getEntitlementOnboarding(entitlementId: string) {
  return db
    .select()
    .from(onboardingItems)
    .where(eq(onboardingItems.entitlementId, entitlementId))
    .orderBy(asc(onboardingItems.position));
}

export async function getOrganizationMembers(organizationId: string) {
  return db
    .select({
      id: organizationMembers.id,
      role: organizationMembers.role,
      name: user.name,
      email: user.email,
    })
    .from(organizationMembers)
    .innerJoin(user, eq(organizationMembers.userId, user.id))
    .where(eq(organizationMembers.organizationId, organizationId));
}
