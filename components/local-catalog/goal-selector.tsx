"use client";

import { Button } from "@/components/ui/button";
import { CatalogSection } from "@/components/local-catalog/catalog-section";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { CATALOG_ICONS } from "@/components/local-catalog/icon-map";
import { SelectableCard } from "@/components/local-catalog/selectable-card";
import { GOALS } from "@/lib/local-catalog/catalog";

export function GoalSelector() {
  const { selectedGoals, toggleGoal, continueFlow } = useCatalog();

  return (
    <CatalogSection
      id="objetivos"
      eyebrow="Paso 2"
      title="¿Qué quieres mejorar?"
      description="Puedes elegir más de uno. Cada objetivo te sugiere piezas concretas, sin jerga técnica."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GOALS.map((goal) => {
          const Icon = CATALOG_ICONS[goal.icon];
          return (
            <SelectableCard
              key={goal.id}
              selected={selectedGoals.includes(goal.id)}
              title={goal.title}
              description={goal.description}
              icon={<Icon className="size-5" aria-hidden="true" />}
              onSelect={() => toggleGoal(goal.id)}
            />
          );
        })}
      </div>
      <div className="pt-2">
        <Button className="h-12 w-full sm:w-auto sm:px-6" onClick={continueFlow}>
          Continuar
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Si no estás seguro, continúa: en el siguiente paso puedes explorar o
          usar un paquete listo.
        </p>
      </div>
    </CatalogSection>
  );
}
