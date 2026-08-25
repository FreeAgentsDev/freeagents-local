import {
  enforceExclusiveGroups,
  getRecommendations,
  mergeGoalSolutions,
  uniqueIds,
} from "@/lib/local-catalog/catalog";
import type { BusinessTypeId, GoalId, SolutionId } from "@/lib/local-catalog/types";

export function suggestedSolutions(
  businessType: BusinessTypeId | null,
  selectedGoals: GoalId[],
): SolutionId[] {
  const fromBusiness = businessType
    ? getRecommendations(businessType).solutions
    : [];
  const fromGoals = mergeGoalSolutions(selectedGoals);
  return enforceExclusiveGroups(uniqueIds([...fromBusiness, ...fromGoals]));
}

export function isRecommendedForBusiness(
  businessType: BusinessTypeId | null,
  solutionId: SolutionId,
): boolean {
  if (!businessType) {
    return false;
  }
  return getRecommendations(businessType).solutions.includes(solutionId);
}

export function isSuggestedByGoals(
  selectedGoals: GoalId[],
  solutionId: SolutionId,
): boolean {
  return mergeGoalSolutions(selectedGoals).includes(solutionId);
}
