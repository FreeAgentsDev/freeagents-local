"use client";

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import {
  formatMonthlyTotal,
  formatSetupTotal,
} from "@/lib/local-catalog/pricing";

export function SolutionSummary({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { result, continueFlow, canContinue, continueLabel, step, openLead } =
    useCatalog();

  const primaryAction =
    step === "impact"
      ? () => openLead("want_solution")
      : continueFlow;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Tu solución
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.includedLabels.length > 0
            ? "Piezas seleccionadas"
            : "Todavía no has sumado piezas"}
        </p>
      </div>

      {result.includedLabels.length > 0 ? (
        <ul className="space-y-2">
          {result.includedLabels.map((label) => (
            <li key={label} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon className="size-3" aria-hidden="true" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Elige un paquete o suma soluciones para ver la inversión.
        </p>
      )}

      <div className="space-y-3">
        <div className="rounded-xl bg-muted/70 p-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Inversión inicial
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight">
            {formatSetupTotal(result.setupPrice, result.isSetupFrom)}
          </p>
          <p className="text-xs text-muted-foreground">Pago único de implementación</p>
        </div>
        <div className="rounded-xl bg-muted/70 p-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Mensualidad
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight">
            {formatMonthlyTotal(result.monthlyPrice, result.isMonthlyFrom)}
          </p>
          <p className="text-xs text-muted-foreground">Plataforma, pago mensual</p>
        </div>
      </div>

      {!compact && result.impact.hasMonetaryEstimate ? (
        <p className="text-sm text-muted-foreground">
          Hay una estimación de valor potencial con los datos que ya ingresaste.
          La verás completa en el último paso.
        </p>
      ) : null}

      <Button
        className="h-11 w-full"
        disabled={!canContinue && step === "solutions"}
        onClick={primaryAction}
      >
        {continueLabel}
      </Button>
    </div>
  );
}
