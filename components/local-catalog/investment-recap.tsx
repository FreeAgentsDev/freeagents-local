"use client";

import { Button } from "@/components/ui/button";
import { CatalogSection } from "@/components/local-catalog/catalog-section";
import { ExpandableComponent } from "@/components/local-catalog/expandable-component";
import { ThirdPartyNotice } from "@/components/local-catalog/third-party-notice";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import {
  getBusinessType,
  getGoal,
} from "@/lib/local-catalog/catalog";
import {
  formatMonthlyTotal,
  formatSetupTotal,
} from "@/lib/local-catalog/pricing";

export function InvestmentRecap() {
  const {
    businessTypeId,
    selectedGoals,
    result,
    continueFlow,
    canContinue,
  } = useCatalog();

  const businessLabel = businessTypeId
    ? getBusinessType(businessTypeId).name
    : "Negocio por definir";

  return (
    <CatalogSection
      id="inversion"
      eyebrow="Paso 4"
      title="Tu inversión"
      description="Esto es lo que estás armando: un pago único de implementación y una mensualidad de plataforma."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Para</p>
          <p className="font-heading text-xl font-semibold">{businessLabel}</p>
          {selectedGoals.length > 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Objetivos:{" "}
              {selectedGoals.map((id) => getGoal(id).title).join(" · ")}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Implementación
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold tracking-tight">
              {formatSetupTotal(result.setupPrice, result.isSetupFrom)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Pago único</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Plataforma
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold tracking-tight">
              {formatMonthlyTotal(result.monthlyPrice, result.isMonthlyFrom)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Pago mensual</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold">Qué incluye</h3>
          {result.components.length > 0 ? (
            <div className="space-y-3">
              {result.components.map((item) => (
                <ExpandableComponent key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Vuelve a tu solución para sumar piezas.
            </p>
          )}
        </div>

        <ThirdPartyNotice notes={result.thirdPartyNotes} />

        <Button
          className="h-12 w-full sm:w-auto sm:px-6"
          disabled={!canContinue}
          onClick={continueFlow}
        >
          Ver el valor potencial
        </Button>
      </div>
    </CatalogSection>
  );
}
