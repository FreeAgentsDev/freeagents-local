"use client";

import { CatalogSection } from "@/components/local-catalog/catalog-section";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_HOUR_RANGES, CLIENT_RANGES } from "@/lib/local-catalog/catalog";
import { getRequiredMetricKeys } from "@/lib/local-catalog/impact";
import { formatCop } from "@/lib/local-catalog/pricing";
import { cn } from "@/lib/utils";

export function ImpactCalculator() {
  const { selectedSolutions, metrics, setMetric } = useCatalog();
  const required = getRequiredMetricKeys(selectedSolutions);

  if (required.length === 0) {
    return (
      <CatalogSection
        id="calculadora"
        eyebrow="Paso 5"
        title="Estimación de valor potencial"
        description="Con las piezas que elegiste no inventamos un número. Abajo verás qué puede mejorar, con lenguaje conservador."
      >
        <p className="text-sm text-muted-foreground">
          No pedimos más datos porque no hay una fórmula responsable para
          convertirlos en dinero con esta configuración.
        </p>
      </CatalogSection>
    );
  }

  return (
    <CatalogSection
      id="calculadora"
      eyebrow="Paso 5"
      title="Estimación de valor potencial"
      description="Solo pedimos los datos necesarios para esta configuración. Son hipótesis conservadoras, no una garantía."
    >
      <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
        {required.includes("monthlyClientsRange") ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">
              ¿Cuántos clientes atiendes aproximadamente al mes?
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {CLIENT_RANGES.map((range) => (
                <Choice
                  key={range.id}
                  selected={metrics.monthlyClientsRange === range.id}
                  label={range.label}
                  onSelect={() => setMetric("monthlyClientsRange", range.id)}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        {required.includes("averageTicket") ? (
          <div className="space-y-2">
            <Label htmlFor="ticket-promedio">
              ¿Cuánto gasta aproximadamente un cliente?
            </Label>
            <div className="relative max-w-xs">
              <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="ticket-promedio"
                type="number"
                min={0}
                inputMode="numeric"
                className="h-11 pl-6"
                value={metrics.averageTicket ?? ""}
                placeholder="Ej. 45000"
                onChange={(event) => {
                  const next = event.target.value;
                  setMetric(
                    "averageTicket",
                    next === "" ? null : Math.max(0, Number(next) || 0),
                  );
                }}
              />
            </div>
            {metrics.averageTicket ? (
              <p className="text-xs text-muted-foreground">
                {formatCop(metrics.averageTicket)} COP
              </p>
            ) : null}
          </div>
        ) : null}

        {required.includes("weeklyAdminHoursRange") ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">
              ¿Cuántas horas a la semana dedicas a tareas repetitivas?
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ADMIN_HOUR_RANGES.map((range) => (
                <Choice
                  key={range.id}
                  selected={metrics.weeklyAdminHoursRange === range.id}
                  label={range.label}
                  onSelect={() => setMetric("weeklyAdminHoursRange", range.id)}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        {required.includes("hourlyValue") ? (
          <div className="space-y-2">
            <Label htmlFor="valor-hora">
              ¿Cuánto valoras aproximadamente una hora de tu tiempo?
            </Label>
            <div className="relative max-w-xs">
              <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="valor-hora"
                type="number"
                min={0}
                inputMode="numeric"
                className="h-11 pl-6"
                value={metrics.hourlyValue ?? ""}
                placeholder="Ej. 25000"
                onChange={(event) => {
                  const next = event.target.value;
                  setMetric(
                    "hourlyValue",
                    next === "" ? null : Math.max(0, Number(next) || 0),
                  );
                }}
              />
            </div>
            {metrics.hourlyValue ? (
              <p className="text-xs text-muted-foreground">
                {formatCop(metrics.hourlyValue)} COP
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </CatalogSection>
  );
}

function Choice({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "h-11 rounded-xl border text-sm font-medium transition-colors",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected
          ? "border-primary bg-accent text-foreground"
          : "border-border bg-background hover:border-primary/40",
      )}
    >
      {label}
    </button>
  );
}
