"use client";

import { CheckIcon } from "lucide-react";

import { CatalogSection } from "@/components/local-catalog/catalog-section";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { getBusinessType } from "@/lib/local-catalog/catalog";
import {
  formatCopPerMonth,
  formatMonthlyTotal,
  formatSetupTotal,
} from "@/lib/local-catalog/pricing";

export function ResultSummary() {
  const { businessTypeId, result } = useCatalog();
  const { impact } = result;
  const businessLabel = businessTypeId
    ? getBusinessType(businessTypeId).name
    : "tu negocio";

  return (
    <CatalogSection
      id="resultado"
      title="Tu sistema FreeAgents Local"
      description="Un resumen claro de lo que armaste, cuánto inviertes y qué valor potencial podría representar."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-primary/20 bg-accent/40 p-6 ring-1 ring-primary/10">
          <p className="text-sm text-muted-foreground">Para</p>
          <p className="font-heading text-2xl font-semibold">{businessLabel}</p>
          <ul className="mt-4 space-y-2">
            {result.includedLabels.map((label) => (
              <li key={label} className="flex items-center gap-2 text-sm">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckIcon className="size-3" aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">Tu inversión</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Implementación</p>
              <p className="mt-1 font-heading text-2xl font-semibold">
                {formatSetupTotal(result.setupPrice, result.isSetupFrom)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Mensualidad</p>
              <p className="mt-1 font-heading text-2xl font-semibold">
                {formatMonthlyTotal(result.monthlyPrice, result.isMonthlyFrom)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">Valor potencial</h3>
          <div className="mt-3 grid gap-3">
            {impact.recoverableRevenue != null && impact.recoverableRevenue > 0 ? (
              <ImpactCard
                title="Ingresos potencialmente recuperables"
                value={formatCopPerMonth(impact.recoverableRevenue)}
                hint="Basado en los datos que proporcionaste y un supuesto conservador."
              />
            ) : null}
            {impact.recoveredHoursPerMonth != null &&
            impact.recoveredHoursPerMonth > 0 ? (
              <ImpactCard
                title="Tiempo potencialmente recuperado"
                value={`${impact.recoveredHoursPerMonth} horas / mes`}
                hint={
                  impact.timeValuePerMonth
                    ? `Valor potencial aproximado: ${formatCopPerMonth(impact.timeValuePerMonth)}`
                    : "Potencial de tiempo recuperado según tus horas administrativas."
                }
              />
            ) : null}
            {impact.extraCapacityClients != null &&
            impact.extraCapacityClients > 0 ? (
              <ImpactCard
                title="Capacidad adicional"
                value={`Hasta ${impact.extraCapacityClients} clientes`}
                hint="Sin aumentar proporcionalmente el trabajo administrativo, según los supuestos usados."
              />
            ) : null}
            {impact.qualitative.map((item) => (
              <ImpactCard
                key={item.title}
                title={item.title}
                value={null}
                hint={item.description}
              />
            ))}
            {!impact.hasMonetaryEstimate && impact.qualitative.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Completa los datos de arriba para ver una estimación, o pide una
                asesoría para dimensionar el impacto contigo.
              </p>
            ) : null}
          </div>
        </div>

        {result.paybackMonths != null && impact.hasMonetaryEstimate ? (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-heading text-lg font-semibold">
              ¿Cuándo el valor potencial equivaldría a la inversión?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Con estos supuestos, el valor potencial acumulado equivaldría a la
              inversión inicial en aproximadamente{" "}
              <span className="font-medium text-foreground">
                {result.paybackMonths}{" "}
                {result.paybackMonths === 1 ? "mes" : "meses"}
              </span>
              .
            </p>
          </div>
        ) : null}

        <p className="text-xs leading-relaxed text-muted-foreground">
          Estas cifras son estimaciones orientativas calculadas a partir de la
          información proporcionada y supuestos conservadores. No representan
          una garantía de resultados.
        </p>
      </div>
    </CatalogSection>
  );
}

function ImpactCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | null;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm font-medium">{title}</p>
      {value ? (
        <p className="mt-1 font-heading text-2xl font-semibold">{value}</p>
      ) : null}
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
