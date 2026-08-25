"use client";

import { useState } from "react";

import { CatalogSection } from "@/components/local-catalog/catalog-section";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { CATALOG_ICONS } from "@/components/local-catalog/icon-map";
import { SelectableCard } from "@/components/local-catalog/selectable-card";
import { BUSINESS_TYPES, getRecommendations, getSolution } from "@/lib/local-catalog/catalog";

export function BusinessSelector() {
  const { businessTypeId, setBusinessType } = useCatalog();
  const [showMore, setShowMore] = useState(false);

  const featured = BUSINESS_TYPES.filter((type) => type.featured);
  const extra = BUSINESS_TYPES.filter((type) => !type.featured);
  const visible = showMore ? [...featured, ...extra] : featured;

  return (
    <CatalogSection
      id="tipo-de-negocio"
      eyebrow="Paso 1"
      title="¿Qué tipo de negocio tienes?"
      description="Elige el que más se parece al tuyo. Te sugerimos un punto de partida, y luego lo puedes ajustar."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visible.map((type) => {
          const Icon = CATALOG_ICONS[type.icon];
          const selected = businessTypeId === type.id;
          const recommended = selected
            ? getRecommendations(type.id).solutions.slice(0, 4)
            : [];

          return (
            <SelectableCard
              key={type.id}
              selected={selected}
              title={type.name}
              description={type.description}
              icon={<Icon className="size-5" aria-hidden="true" />}
              onSelect={() => setBusinessType(type.id)}
              badge={
                recommended.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Sugerido:{" "}
                    {recommended.map((id) => getSolution(id).name).join(" · ")}
                  </p>
                ) : null
              }
            />
          );
        })}
      </div>
      {extra.length > 0 ? (
        <button
          type="button"
          className="mt-4 text-sm font-medium text-primary hover:underline"
          onClick={() => setShowMore((current) => !current)}
        >
          {showMore ? "Ver menos tipos" : "Ver más tipos de negocio"}
        </button>
      ) : null}
    </CatalogSection>
  );
}
