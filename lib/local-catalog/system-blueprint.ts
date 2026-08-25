import { getSolution } from "@/lib/local-catalog/catalog";
import {
  formatSolutionMonthly,
  formatSolutionSetup,
} from "@/lib/local-catalog/pricing";
import type { SolutionId, SystemComponent } from "@/lib/local-catalog/types";

export function buildSystemComponents(
  selectedSolutions: SolutionId[],
): SystemComponent[] {
  return selectedSolutions.map((id) => {
    const solution = getSolution(id);
    return {
      id,
      name: solution.name,
      summary: solution.shortDescription,
      details: solution.benefits.join(" "),
      includes: solution.features,
      icon: solution.icon,
      setupLabel: formatSolutionSetup(solution),
      monthlyLabel: formatSolutionMonthly(solution),
      thirdPartyNote: solution.thirdPartyNote,
    };
  });
}
