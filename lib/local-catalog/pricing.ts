import { getSolution } from "@/lib/local-catalog/catalog";
import type { Solution, SolutionId } from "@/lib/local-catalog/types";

export function formatCop(amount: number): string {
  const rounded = Math.round(amount);
  const abs = Math.abs(rounded).toLocaleString("es-CO");
  const sign = rounded < 0 ? "-" : "";
  return `${sign}$${abs}`;
}

export function formatCopPerMonth(amount: number): string {
  return `${formatCop(amount)}/mes`;
}

export function formatCopFrom(amount: number): string {
  return `Desde ${formatCop(amount)}`;
}

export function formatCopFromPerMonth(amount: number): string {
  return `Desde ${formatCopPerMonth(amount)}`;
}

export function formatSolutionSetup(solution: Solution): string {
  if (solution.priceDisplay === "range" && solution.setupPriceMax != null) {
    return `${formatCop(solution.setupPrice)} – ${formatCop(solution.setupPriceMax)}`;
  }
  if (solution.priceDisplay === "from") {
    return formatCopFrom(solution.setupPrice);
  }
  return formatCop(solution.setupPrice);
}

export function formatSolutionMonthly(solution: Solution): string {
  if (solution.priceDisplay === "range" && solution.monthlyPriceMax != null) {
    return `${formatCop(solution.monthlyPrice)} – ${formatCopPerMonth(solution.monthlyPriceMax)}`;
  }
  if (solution.priceDisplay === "from") {
    return formatCopFromPerMonth(solution.monthlyPrice);
  }
  return formatCopPerMonth(solution.monthlyPrice);
}

export function formatSetupTotal(amount: number, isFrom: boolean): string {
  return isFrom ? formatCopFrom(amount) : formatCop(amount);
}

export function formatMonthlyTotal(amount: number, isFrom: boolean): string {
  return isFrom ? formatCopFromPerMonth(amount) : formatCopPerMonth(amount);
}

export function isVariablePrice(solution: Solution): boolean {
  return solution.priceDisplay === "from" || solution.priceDisplay === "range";
}

export function sumSelectedPricing(ids: SolutionId[]): {
  setupPrice: number;
  monthlyPrice: number;
  isSetupFrom: boolean;
  isMonthlyFrom: boolean;
} {
  const solutions = ids.map(getSolution);
  const setupPrice = solutions.reduce((sum, item) => sum + item.setupPrice, 0);
  const monthlyPrice = solutions.reduce(
    (sum, item) => sum + item.monthlyPrice,
    0,
  );
  const isSetupFrom = solutions.some(isVariablePrice);
  const isMonthlyFrom = solutions.some(isVariablePrice);

  return { setupPrice, monthlyPrice, isSetupFrom, isMonthlyFrom };
}
