"use client";

import { Button } from "@/components/ui/button";
import { useCatalog } from "@/components/local-catalog/catalog-provider";

export function CatalogHero() {
  const { startGuided, startExplore, started } = useCatalog();

  return (
    <section className="relative overflow-hidden px-4 pt-14 pb-10 sm:pt-20 sm:pb-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(19,200,236,0.14),_transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase">
          FreeAgents Local
        </p>
        <h1 className="font-heading text-4xl font-black tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
          Construye la tecnología que tu negocio necesita.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
          Identifica tu negocio, elige qué quieres mejorar y arma una solución
          con precios claros: implementación, mensualidad y el valor potencial
          estimado.
        </p>
        {!started ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="h-12 w-full px-6 sm:w-auto" onClick={startGuided}>
              Crear mi solución
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full px-6 sm:w-auto"
              onClick={startExplore}
            >
              Explorar soluciones
            </Button>
          </div>
        ) : null}
        <p className="mt-6 text-sm text-muted-foreground">
          Precios transparentes · Empieza desde $0 · Hecho para comercios locales
        </p>
      </div>
    </section>
  );
}
