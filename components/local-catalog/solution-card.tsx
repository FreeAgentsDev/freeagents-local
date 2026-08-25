"use client";

import { Badge } from "@/components/ui/badge";
import { CATALOG_ICONS } from "@/components/local-catalog/icon-map";
import {
  formatSolutionMonthly,
  formatSolutionSetup,
} from "@/lib/local-catalog/pricing";
import type { Solution } from "@/lib/local-catalog/types";
import { cn } from "@/lib/utils";

type SolutionCardProps = {
  solution: Solution;
  selected: boolean;
  recommended?: boolean;
  fromGoal?: boolean;
  onToggle: () => void;
};

export function SolutionCard({
  solution,
  selected,
  recommended,
  fromGoal,
  onToggle,
}: SolutionCardProps) {
  const Icon = CATALOG_ICONS[solution.icon];

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border bg-card shadow-sm transition-all duration-200",
        selected
          ? "border-primary bg-accent/70 ring-2 ring-primary/25 shadow-[0_0_24px_rgba(19,200,236,0.12)]"
          : "border-border",
      )}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onToggle}
        className="flex flex-1 flex-col items-start gap-3 p-4 text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <div className="flex w-full items-start justify-between gap-3">
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-lg transition-colors",
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "mt-1 flex size-5 items-center justify-center rounded-full border transition-all",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background",
            )}
          >
            {selected ? (
              <svg viewBox="0 0 16 16" className="size-3" fill="none">
                <path
                  d="M3.5 8.5 6.5 11.5 12.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
        </div>
        <div className="space-y-1">
          <p className="font-medium tracking-tight">{solution.name}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {solution.shortDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {recommended ? <Badge variant="secondary">Recomendado</Badge> : null}
          {fromGoal ? <Badge variant="outline">Para tu objetivo</Badge> : null}
          {solution.popular ? <Badge variant="outline">Popular</Badge> : null}
        </div>
        <div className="mt-auto space-y-0.5 text-sm">
          <p>
            <span className="text-muted-foreground">Implementación </span>
            <span className="font-medium">{formatSolutionSetup(solution)}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Mensualidad </span>
            <span className="font-medium">{formatSolutionMonthly(solution)}</span>
          </p>
        </div>
      </button>
      <details className="border-t border-border px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-primary">
          Qué incluye
        </summary>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {solution.features.map((feature) => (
            <li key={feature}>· {feature}</li>
          ))}
        </ul>
        {solution.thirdPartyNote ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {solution.thirdPartyNote}
          </p>
        ) : null}
      </details>
    </div>
  );
}
