import { BUSINESS_TYPES, RECOMMENDATIONS } from "@/lib/local-catalog/data/business-types";
import { GOALS } from "@/lib/local-catalog/data/goals";
import { PACKAGES } from "@/lib/local-catalog/data/packages";
import {
  EXCLUSIVE_SOLUTION_GROUPS,
  SOLUTIONS,
} from "@/lib/local-catalog/data/solutions";
import type {
  BusinessType,
  BusinessTypeId,
  CatalogStep,
  Goal,
  GoalId,
  Package,
  PackageId,
  Recommendation,
  Solution,
  SolutionId,
} from "@/lib/local-catalog/types";

export { BUSINESS_TYPES, RECOMMENDATIONS } from "@/lib/local-catalog/data/business-types";
export { GOALS } from "@/lib/local-catalog/data/goals";
export { PACKAGES } from "@/lib/local-catalog/data/packages";
export {
  ADMIN_HOUR_RANGES,
  CLIENT_RANGES,
  EMPTY_METRICS,
} from "@/lib/local-catalog/data/metrics";
export { IMPACT_ASSUMPTIONS } from "@/lib/local-catalog/data/assumptions";
export {
  EXCLUSIVE_SOLUTION_GROUPS,
  SOLUTIONS,
  SOLUTION_CATEGORIES,
} from "@/lib/local-catalog/data/solutions";

export const CATALOG_STEPS: Array<{ id: CatalogStep; label: string; short: string }> = [
  { id: "business", label: "Tu negocio", short: "1" },
  { id: "goals", label: "Tu objetivo", short: "2" },
  { id: "solutions", label: "Tu solución", short: "3" },
  { id: "investment", label: "Tu inversión", short: "4" },
  { id: "impact", label: "Tu impacto", short: "5" },
];

/** Fill with a real WhatsApp URL, e.g. https://wa.me/57XXXXXXXXXX */
export const CATALOG_CONTACT = {
  whatsappUrl: "",
};

export const THIRD_PARTY_COST_ITEMS = [
  "WhatsApp / Meta",
  "Pasarelas de pago",
  "Dominios",
  "Servicios externos",
  "Proveedores de correo",
  "Herramientas de terceros",
] as const;

export function getBusinessType(id: BusinessTypeId): BusinessType {
  const item = BUSINESS_TYPES.find((type) => type.id === id);
  if (!item) {
    throw new Error(`Unknown business type: ${id}`);
  }
  return item;
}

export function getSolution(id: SolutionId): Solution {
  const item = SOLUTIONS.find((solution) => solution.id === id);
  if (!item) {
    throw new Error(`Unknown solution: ${id}`);
  }
  return item;
}

export function getGoal(id: GoalId): Goal {
  const item = GOALS.find((goal) => goal.id === id);
  if (!item) {
    throw new Error(`Unknown goal: ${id}`);
  }
  return item;
}

export function getPackage(id: PackageId): Package {
  const item = PACKAGES.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Unknown package: ${id}`);
  }
  return item;
}

export function getRecommendations(businessType: BusinessTypeId): Recommendation {
  return RECOMMENDATIONS[businessType];
}

export function uniqueIds<T extends string>(ids: T[]): T[] {
  return [...new Set(ids)];
}

export function enforceExclusiveGroups(
  selected: SolutionId[],
  newlyAdded?: SolutionId,
): SolutionId[] {
  let next = uniqueIds(selected);

  for (const group of EXCLUSIVE_SOLUTION_GROUPS) {
    const present = next.filter((id) => group.includes(id));
    if (present.length <= 1) {
      continue;
    }
    const keep =
      newlyAdded && group.includes(newlyAdded)
        ? newlyAdded
        : present[0];
    next = next.filter((id) => !group.includes(id) || id === keep);
  }

  return next;
}

export function applyPackageSolutions(packageId: PackageId): SolutionId[] {
  return enforceExclusiveGroups(getPackage(packageId).solutionIds);
}

export function mergeGoalSolutions(goalIds: GoalId[]): SolutionId[] {
  const solutions: SolutionId[] = [];
  for (const goalId of goalIds) {
    solutions.push(...getGoal(goalId).solutions);
  }
  return enforceExclusiveGroups(uniqueIds(solutions));
}

export function getStepIndex(step: CatalogStep): number {
  return CATALOG_STEPS.findIndex((entry) => entry.id === step);
}
