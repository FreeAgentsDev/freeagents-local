import { IMPACT_ASSUMPTIONS } from "@/lib/local-catalog/data/assumptions";
import { ADMIN_HOUR_RANGES, CLIENT_RANGES } from "@/lib/local-catalog/data/metrics";
import { getSolution } from "@/lib/local-catalog/catalog";
import type {
  AdminHoursRangeId,
  BusinessMetrics,
  ClientRangeId,
  ImpactBreakdown,
  ImpactType,
  QualitativeImpact,
  SolutionId,
} from "@/lib/local-catalog/types";

function midpointOf<T extends string>(
  options: Array<{ id: T; midpoint: number }>,
  id: T | null,
): number | null {
  if (!id) {
    return null;
  }
  return options.find((option) => option.id === id)?.midpoint ?? null;
}

export function getMonthlyClients(
  range: ClientRangeId | null,
): number | null {
  return midpointOf(CLIENT_RANGES, range);
}

export function getWeeklyAdminHours(
  range: AdminHoursRangeId | null,
): number | null {
  return midpointOf(ADMIN_HOUR_RANGES, range);
}

export function getRequiredMetricKeys(solutionIds: SolutionId[]): Array<
  keyof BusinessMetrics
> {
  const keys = new Set<keyof BusinessMetrics>();
  const impacts = new Set<ImpactType>();

  for (const id of solutionIds) {
    for (const impact of getSolution(id).impacts) {
      impacts.add(impact);
    }
  }

  if (impacts.has("revenue")) {
    keys.add("monthlyClientsRange");
    keys.add("averageTicket");
  }

  if (solutionIds.includes("booking") && impacts.has("time_saved")) {
    keys.add("weeklyAdminHoursRange");
    keys.add("hourlyValue");
  }

  return [...keys];
}

function uniqueQualitative(items: QualitativeImpact[]): QualitativeImpact[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.title)) {
      return false;
    }
    seen.add(item.title);
    return true;
  });
}

export function calculateImpact(
  solutionIds: SolutionId[],
  metrics: BusinessMetrics,
): ImpactBreakdown {
  const selected = new Set(solutionIds);
  const monthlyClients = getMonthlyClients(metrics.monthlyClientsRange);
  const weeklyHours = getWeeklyAdminHours(metrics.weeklyAdminHoursRange);
  const ticket = metrics.averageTicket;
  const hourlyValue = metrics.hourlyValue;
  const qualitative: QualitativeImpact[] = [];

  let recoverableRevenue: number | null = null;

  if (
    selected.has("clients") &&
    monthlyClients != null &&
    ticket != null &&
    ticket > 0
  ) {
    recoverableRevenue = Math.round(
      monthlyClients * ticket * IMPACT_ASSUMPTIONS.crmRecoveryRate,
    );
  }

  if (
    (selected.has("catalog") || selected.has("store")) &&
    monthlyClients != null &&
    ticket != null &&
    ticket > 0
  ) {
    const catalogOpportunity = Math.round(
      monthlyClients * ticket * IMPACT_ASSUMPTIONS.catalogOpportunityRate,
    );
    recoverableRevenue = (recoverableRevenue ?? 0) + catalogOpportunity;
  }

  let recoveredHoursPerMonth: number | null = null;
  let timeValuePerMonth: number | null = null;

  if (selected.has("booking") && weeklyHours != null) {
    recoveredHoursPerMonth = Math.round(
      weeklyHours *
        IMPACT_ASSUMPTIONS.bookingTimeReduction *
        IMPACT_ASSUMPTIONS.weeksPerMonth,
    );
    if (hourlyValue != null && hourlyValue > 0) {
      timeValuePerMonth = Math.round(recoveredHoursPerMonth * hourlyValue);
    }
  }

  if (selected.has("automations")) {
    qualitative.push({
      type: "time_saved",
      title: "Reduce tareas manuales",
      description:
        "Las automatizaciones pueden hacer que tareas repetitivas se ejecuten solas. Sin datos de procesos y minutos, no estimamos un valor en dinero.",
    });
  }

  if (selected.has("inventory")) {
    qualitative.push({
      type: "cost_saved",
      title: "Menos pérdidas y quiebres de stock",
      description:
        "Puede ayudarte a reducir pérdidas y quiebres de stock. No mostramos un valor en dinero hasta tener variables más confiables.",
    });
  }

  if (selected.has("whatsapp")) {
    qualitative.push({
      type: "organization",
      title: "Mejor seguimiento por WhatsApp",
      description:
        "Ayuda a dar la bienvenida, responder y dar seguimiento desde el chat que ya usan tus clientes.",
    });
  }

  if (selected.has("dashboard") || selected.has("pos")) {
    qualitative.push({
      type: "organization",
      title: "Más claridad para decidir",
      description:
        "Te ayuda a ver ventas, caja y movimiento del negocio sin armar reportes a mano.",
    });
  }

  if (
    selected.has("digital_profile") ||
    selected.has("landing") ||
    selected.has("website")
  ) {
    qualitative.push({
      type: "organization",
      title: "Presencia digital más clara",
      description:
        "Facilita que te encuentren, te escriban y entiendan qué ofreces.",
    });
  }

  if (selected.has("custom")) {
    qualitative.push({
      type: "organization",
      title: "Una solución hecha para tu operación",
      description:
        "El valor depende de lo que construyamos juntos. Lo estimamos en la asesoría.",
    });
  }

  let extraCapacityClients: number | null = null;
  if (
    selected.has("booking") &&
    monthlyClients != null &&
    weeklyHours != null
  ) {
    extraCapacityClients = Math.round(
      monthlyClients * IMPACT_ASSUMPTIONS.bookingTimeReduction,
    );
  }

  const hasMonetaryEstimate =
    (recoverableRevenue != null && recoverableRevenue > 0) ||
    (timeValuePerMonth != null && timeValuePerMonth > 0);

  return {
    recoverableRevenue,
    recoveredHoursPerMonth,
    timeValuePerMonth,
    extraCapacityClients,
    qualitative: uniqueQualitative(qualitative),
    hasMonetaryEstimate,
  };
}
