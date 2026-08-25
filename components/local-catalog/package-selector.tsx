"use client";

import { CatalogSection } from "@/components/local-catalog/catalog-section";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { CATALOG_ICONS } from "@/components/local-catalog/icon-map";
import { PACKAGES } from "@/lib/local-catalog/catalog";
import {
  formatCopFrom,
  formatCopFromPerMonth,
} from "@/lib/local-catalog/pricing";
import type { Package } from "@/lib/local-catalog/types";
import { cn } from "@/lib/utils";

const ACCENT: Record<Package["accent"], string> = {
  green: "border-emerald-500/40 bg-emerald-500/5",
  blue: "border-sky-500/40 bg-sky-500/5",
  violet: "border-primary/40 bg-primary/5",
  orange: "border-orange-500/40 bg-orange-500/5",
  red: "border-rose-500/40 bg-rose-500/5",
};

export function PackageSelector() {
  const { activePackageId, applyPackage } = useCatalog();

  return (
    <CatalogSection
      id="paquetes"
      eyebrow="Punto de partida"
      title="Paquetes listos"
      description="Elige uno para empezar. Luego puedes quitar o sumar piezas. El total siempre es la suma de lo que selecciones."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PACKAGES.map((item) => {
          const Icon = CATALOG_ICONS[item.icon];
          const selected = activePackageId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => applyPackage(item.id)}
              className={cn(
                "flex h-full flex-col items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-sm transition-all duration-200",
                "hover:border-primary/40 hover:shadow-md",
                "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                selected
                  ? "border-primary bg-accent/70 ring-2 ring-primary/25 shadow-[0_0_24px_rgba(19,200,236,0.12)]"
                  : "border-border",
              )}
            >
              <div className="flex w-full items-start justify-between gap-3">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    ACCENT[item.accent],
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {selected ? (
                  <span className="text-xs font-medium text-primary">Seleccionado</span>
                ) : null}
              </div>
              <div className="space-y-1">
                <p className="font-medium tracking-tight">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.message}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="mt-auto space-y-0.5 text-sm">
                <p className="font-semibold">
                  {item.fromSetup === 0
                    ? "Desde $0"
                    : formatCopFrom(item.fromSetup)}
                </p>
                <p className="text-muted-foreground">
                  {formatCopFromPerMonth(item.fromMonthly)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </CatalogSection>
  );
}
