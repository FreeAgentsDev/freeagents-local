import {
  getBusinessType,
  getGoal,
  getSolution,
} from "@/lib/local-catalog/catalog";
import type {
  BusinessMetrics,
  CatalogLeadPayload,
  GoalId,
  SolutionId,
  SolutionResult,
  BusinessTypeId,
} from "@/lib/local-catalog/types";

export function buildLeadPayload(input: {
  contact: CatalogLeadPayload["contact"];
  businessType: BusinessTypeId | null;
  selectedGoals: GoalId[];
  selectedSolutions: SolutionId[];
  metrics: BusinessMetrics;
  result: SolutionResult;
  sourceCta: string;
}): CatalogLeadPayload {
  const businessTypeLabel = input.businessType
    ? getBusinessType(input.businessType).name
    : "Sin definir";

  return {
    contact: input.contact,
    configuration: {
      businessType: input.businessType,
      businessTypeLabel,
      goals: input.selectedGoals,
      goalLabels: input.selectedGoals.map((id) => getGoal(id).title),
      solutions: input.selectedSolutions,
      solutionLabels: input.selectedSolutions.map((id) => getSolution(id).name),
      setupPrice: input.result.setupPrice,
      monthlyPrice: input.result.monthlyPrice,
      isSetupFrom: input.result.isSetupFrom,
      isMonthlyFrom: input.result.isMonthlyFrom,
    },
    calculator: input.metrics,
    estimates: {
      recoverableRevenue: input.result.impact.recoverableRevenue,
      recoveredHoursPerMonth: input.result.impact.recoveredHoursPerMonth,
      timeValuePerMonth: input.result.impact.timeValuePerMonth,
      extraCapacityClients: input.result.impact.extraCapacityClients,
      qualitative: input.result.impact.qualitative.map((item) => item.title),
      paybackMonths: input.result.paybackMonths,
    },
    sourceCta: input.sourceCta,
  };
}

export function buildWhatsAppText(payload: CatalogLeadPayload): string {
  const lines = [
    "Hola FreeAgents, quiero construir esta solución para mi negocio.",
    "",
    `Negocio: ${payload.contact.business || payload.configuration.businessTypeLabel}`,
    `Tipo: ${payload.configuration.businessTypeLabel}`,
    payload.configuration.goalLabels.length
      ? `Objetivos: ${payload.configuration.goalLabels.join(", ")}`
      : null,
    payload.configuration.solutionLabels.length
      ? `Solución: ${payload.configuration.solutionLabels.join(", ")}`
      : null,
    `Implementación: ${payload.configuration.setupPrice}`,
    `Mensualidad: ${payload.configuration.monthlyPrice}`,
  ].filter((line): line is string => line != null);

  return lines.join("\n");
}
