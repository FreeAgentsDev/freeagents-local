"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { SolutionSummary } from "@/components/local-catalog/solution-summary";
import {
  formatMonthlyTotal,
  formatSetupTotal,
} from "@/lib/local-catalog/pricing";

export function MobileSummaryBar() {
  const { showSummary, result, continueFlow, canContinue, continueLabel, step } =
    useCatalog();
  const [open, setOpen] = useState(false);

  if (!showSummary || step === "business" || step === "goals") {
    return null;
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            type="button"
            className="min-w-0 flex-1 text-left"
            onClick={() => setOpen(true)}
          >
            <p className="truncate text-sm font-medium">Tu solución</p>
            <p className="truncate text-sm text-muted-foreground">
              {formatSetupTotal(result.setupPrice, result.isSetupFrom)} ·{" "}
              {formatMonthlyTotal(result.monthlyPrice, result.isMonthlyFrom)}
            </p>
          </button>
          <Button
            className="h-11 shrink-0 px-4"
            disabled={!canContinue && step === "solutions"}
            onClick={continueFlow}
          >
            {continueLabel}
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto lg:hidden"
        >
          <SheetHeader>
            <SheetTitle>Tu solución</SheetTitle>
            <SheetDescription>
              Implementación, mensualidad y piezas seleccionadas.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <SolutionSummary />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
