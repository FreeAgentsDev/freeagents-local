"use client";

import { CheckIcon } from "lucide-react";

import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { CATALOG_STEPS, getStepIndex } from "@/lib/local-catalog/catalog";
import type { CatalogStep } from "@/lib/local-catalog/types";
import { cn } from "@/lib/utils";

export function StepProgress() {
  const { step, goToStep, businessTypeId, selectedSolutions } = useCatalog();
  const currentIndex = getStepIndex(step);

  function canVisit(target: CatalogStep) {
    const targetIndex = getStepIndex(target);
    if (targetIndex <= currentIndex) {
      return true;
    }
    if (target === "goals") {
      return Boolean(businessTypeId);
    }
    if (target === "investment" || target === "impact") {
      return selectedSolutions.length > 0;
    }
    return true;
  }

  return (
    <nav aria-label="Progreso del configurador" className="mb-10">
      <ol className="flex items-center gap-1 overflow-x-auto pb-1 sm:gap-2">
        {CATALOG_STEPS.map((item, index) => {
          const active = item.id === step;
          const done = index < currentIndex;
          const enabled = canVisit(item.id);

          return (
            <li key={item.id} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
              <button
                type="button"
                disabled={!enabled}
                onClick={() => enabled && goToStep(item.id)}
                className={cn(
                  "flex w-full min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors sm:px-3",
                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  active && "bg-accent",
                  !enabled && "cursor-not-allowed opacity-40",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    active && "bg-primary text-primary-foreground",
                    done && "bg-primary/15 text-primary",
                    !active && !done && "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? (
                    <CheckIcon className="size-3.5" aria-hidden="true" />
                  ) : (
                    item.short
                  )}
                </span>
                <span
                  className={cn(
                    "hidden truncate text-sm font-medium sm:block",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </button>
              {index < CATALOG_STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-px w-3 shrink-0 sm:block md:w-6",
                    index < currentIndex ? "bg-primary/40" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-sm font-medium text-foreground sm:hidden">
        {CATALOG_STEPS[currentIndex]?.label}
      </p>
    </nav>
  );
}
