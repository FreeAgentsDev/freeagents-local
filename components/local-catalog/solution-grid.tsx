"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { CatalogSection } from "@/components/local-catalog/catalog-section";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { SolutionCard } from "@/components/local-catalog/solution-card";
import {
  SOLUTIONS,
  SOLUTION_CATEGORIES,
  getBusinessType,
} from "@/lib/local-catalog/catalog";
import type { Solution } from "@/lib/local-catalog/types";

export function SolutionGrid() {
  const {
    businessTypeId,
    selectedSolutions,
    toggleSolution,
    isRecommendedSolution,
    isGoalSolution,
    applyRecommended,
    continueFlow,
    canContinue,
  } = useCatalog();
  const [showAll, setShowAll] = useState(false);

  const highlighted = useMemo(
    () =>
      SOLUTIONS.filter(
        (solution) =>
          isRecommendedSolution(solution.id) || isGoalSolution(solution.id),
      ),
    [isGoalSolution, isRecommendedSolution],
  );

  const highlightedIds = new Set(highlighted.map((item) => item.id));
  const remaining = SOLUTIONS.filter((item) => !highlightedIds.has(item.id));
  const visible: Solution[] = showAll ? SOLUTIONS : highlighted.length > 0 ? highlighted : SOLUTIONS.slice(0, 6);

  const grouped = SOLUTION_CATEGORIES.map((category) => ({
    ...category,
    items: visible.filter((item) => item.category === category.id),
  })).filter((group) => group.items.length > 0);

  const businessLabel = businessTypeId
    ? getBusinessType(businessTypeId).name
    : null;

  return (
    <CatalogSection
      id="soluciones"
      eyebrow="Paso 3"
      title="Arma tu solución"
      description="Suma las piezas que tu negocio necesita. El resumen de la derecha (o abajo, en el celular) se actualiza al instante."
    >
      {businessTypeId ? (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Recomendado para {businessLabel}. Puedes aplicarlo y luego ajustar.
          </p>
          <Button variant="outline" className="h-11" onClick={applyRecommended}>
            Usar recomendados
          </Button>
        </div>
      ) : null}

      <div className="space-y-10">
        {grouped.map((group) => (
          <CategoryGroup key={group.id} title={group.title} items={group.items}>
            {group.items.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                selected={selectedSolutions.includes(solution.id)}
                recommended={isRecommendedSolution(solution.id)}
                fromGoal={isGoalSolution(solution.id)}
                onToggle={() => toggleSolution(solution.id)}
              />
            ))}
          </CategoryGroup>
        ))}
      </div>

      {!showAll && remaining.length > 0 ? (
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          onClick={() => setShowAll(true)}
        >
          Ver todas las soluciones
        </button>
      ) : null}

      <div className="pt-2 lg:hidden">
        <Button
          className="h-12 w-full"
          disabled={!canContinue}
          onClick={continueFlow}
        >
          Continuar
        </Button>
      </div>
    </CatalogSection>
  );
}

function CategoryGroup({
  title,
  items,
  children,
}: {
  title: string;
  items: Solution[];
  children: React.ReactNode;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-lg font-semibold tracking-tight">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}
