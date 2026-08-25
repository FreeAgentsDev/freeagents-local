"use client";

import { BusinessSelector } from "@/components/local-catalog/business-selector";
import { FinalCta } from "@/components/local-catalog/final-cta";
import { GoalSelector } from "@/components/local-catalog/goal-selector";
import { CatalogHero } from "@/components/local-catalog/hero";
import { ImpactCalculator } from "@/components/local-catalog/impact-calculator";
import { InvestmentRecap } from "@/components/local-catalog/investment-recap";
import { LeadDialog } from "@/components/local-catalog/lead-dialog";
import { MobileSummaryBar } from "@/components/local-catalog/mobile-summary-bar";
import { PackageSelector } from "@/components/local-catalog/package-selector";
import { ResultSummary } from "@/components/local-catalog/result-summary";
import { StepProgress } from "@/components/local-catalog/step-progress";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { SolutionGrid } from "@/components/local-catalog/solution-grid";
import { SolutionSummary } from "@/components/local-catalog/solution-summary";

export function CatalogBuilder() {
  const { started, step, showSummary } = useCatalog();
  const showAside =
    showSummary &&
    (step === "solutions" || step === "investment" || step === "impact");

  return (
    <>
      <CatalogHero />
      <div
        id="configurador"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pb-28 lg:pb-16"
      >
        {started ? (
          <>
            <StepProgress />
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
              <div className="space-y-12 lg:space-y-16">
                {step === "business" ? <BusinessSelector /> : null}
                {step === "goals" ? <GoalSelector /> : null}
                {step === "solutions" ? (
                  <>
                    <PackageSelector />
                    <SolutionGrid />
                  </>
                ) : null}
                {step === "investment" ? <InvestmentRecap /> : null}
                {step === "impact" ? (
                  <>
                    <ImpactCalculator />
                    <ResultSummary />
                    <FinalCta />
                  </>
                ) : null}
              </div>
              {showAside ? (
                <aside className="hidden lg:block">
                  <div className="sticky top-20 z-10 max-h-[calc(100svh-6rem)] overflow-y-auto">
                    <SolutionSummary />
                  </div>
                </aside>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
      <MobileSummaryBar />
      <LeadDialog />
    </>
  );
}
