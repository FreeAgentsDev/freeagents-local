import { getSolution } from "@/lib/local-catalog/catalog";
import { calculateImpact } from "@/lib/local-catalog/impact";
import { sumSelectedPricing } from "@/lib/local-catalog/pricing";
import { buildSystemComponents } from "@/lib/local-catalog/system-blueprint";
import type {
  CalculateSolutionInput,
  SolutionResult,
} from "@/lib/local-catalog/types";

export function calculateSolution(
  input: CalculateSolutionInput,
): SolutionResult {
  const pricing = sumSelectedPricing(input.selectedSolutions);
  const impact = calculateImpact(input.selectedSolutions, input.metrics);
  const monthlyPotential =
    (impact.recoverableRevenue ?? 0) + (impact.timeValuePerMonth ?? 0);

  const paybackMonths =
    pricing.setupPrice > 0 && monthlyPotential > 0
      ? Math.max(1, Math.ceil(pricing.setupPrice / monthlyPotential))
      : null;

  const thirdPartyNotes = [
    ...new Set(
      input.selectedSolutions
        .map((id) => getSolution(id).thirdPartyNote)
        .filter((note): note is string => Boolean(note)),
    ),
  ];

  return {
    monthlyPrice: pricing.monthlyPrice,
    setupPrice: pricing.setupPrice,
    isSetupFrom: pricing.isSetupFrom,
    isMonthlyFrom: pricing.isMonthlyFrom,
    includedLabels: input.selectedSolutions.map((id) => getSolution(id).name),
    components: buildSystemComponents(input.selectedSolutions),
    impact,
    paybackMonths,
    thirdPartyNotes,
  };
}
