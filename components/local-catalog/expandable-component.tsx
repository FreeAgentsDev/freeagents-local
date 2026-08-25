"use client";

import { CATALOG_ICONS } from "@/components/local-catalog/icon-map";
import type { SystemComponent } from "@/lib/local-catalog/types";
import { cn } from "@/lib/utils";

export function ExpandableComponent({
  item,
  compact = false,
}: {
  item: SystemComponent;
  compact?: boolean;
}) {
  const Icon = CATALOG_ICONS[item.icon];

  return (
    <details
      className={cn(
        "group rounded-xl border border-border bg-card",
        compact && "rounded-lg",
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-start gap-3 p-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          compact && "gap-2 p-3",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground",
            compact && "size-7",
          )}
        >
          <Icon className={compact ? "size-3.5" : "size-4"} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className={cn("font-medium", compact && "text-sm")}>
              {item.name}
            </span>
            <span
              aria-hidden="true"
              className="mt-1 text-muted-foreground transition-transform group-open:rotate-180"
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none">
                <path
                  d="M4 6.5 8 10.5 12 6.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {item.summary}
          </span>
        </span>
      </summary>
      <div
        className={cn(
          "space-y-3 border-t border-border px-4 pt-3 pb-4",
          compact && "px-3 pb-3",
        )}
      >
        <p className="text-sm leading-relaxed text-foreground">{item.details}</p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {item.includes.map((line) => (
            <li key={line} className="flex gap-2">
              <span aria-hidden="true" className="text-primary">
                ·
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>Implementación: {item.setupLabel}</p>
          <p>Mensualidad: {item.monthlyLabel}</p>
          {item.thirdPartyNote ? <p>{item.thirdPartyNote}</p> : null}
        </div>
      </div>
    </details>
  );
}
