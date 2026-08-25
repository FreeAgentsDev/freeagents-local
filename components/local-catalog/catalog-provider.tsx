"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { track } from "@/lib/local-catalog/analytics";
import { calculateSolution } from "@/lib/local-catalog/calculate-solution";
import {
  applyPackageSolutions,
  CATALOG_STEPS,
  enforceExclusiveGroups,
  getGoal,
  getRecommendations,
  getStepIndex,
  uniqueIds,
} from "@/lib/local-catalog/catalog";
import { EMPTY_METRICS } from "@/lib/local-catalog/data/metrics";
import {
  isRecommendedForBusiness,
  isSuggestedByGoals,
} from "@/lib/local-catalog/recommendations";
import type {
  BusinessMetrics,
  BusinessTypeId,
  CatalogStep,
  GoalId,
  PackageId,
  SolutionId,
  SolutionResult,
} from "@/lib/local-catalog/types";

type CatalogMode = "guided" | "explore";

type CatalogContextValue = {
  started: boolean;
  mode: CatalogMode | null;
  step: CatalogStep;
  businessTypeId: BusinessTypeId | null;
  selectedGoals: GoalId[];
  selectedSolutions: SolutionId[];
  activePackageId: PackageId | null;
  metrics: BusinessMetrics;
  leadOpen: boolean;
  leadCta: string;
  result: SolutionResult;
  showBuilder: boolean;
  showSummary: boolean;
  canContinue: boolean;
  continueLabel: string;
  startGuided: () => void;
  startExplore: () => void;
  setBusinessType: (id: BusinessTypeId) => void;
  toggleGoal: (id: GoalId) => void;
  toggleSolution: (id: SolutionId) => void;
  applyPackage: (id: PackageId) => void;
  applyRecommended: () => void;
  goToStep: (step: CatalogStep) => void;
  continueFlow: () => void;
  setMetric: <K extends keyof BusinessMetrics>(
    key: K,
    value: BusinessMetrics[K],
  ) => void;
  openLead: (cta: string) => void;
  closeLead: () => void;
  isRecommendedSolution: (id: SolutionId) => boolean;
  isGoalSolution: (id: SolutionId) => boolean;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

function scrollToId(id: string) {
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 80);
}

function nextStepAfter(step: CatalogStep): CatalogStep | null {
  const index = getStepIndex(step);
  return CATALOG_STEPS[index + 1]?.id ?? null;
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<CatalogMode | null>(null);
  const [step, setStep] = useState<CatalogStep>("business");
  const [businessTypeId, setBusinessTypeId] = useState<BusinessTypeId | null>(
    null,
  );
  const [selectedGoals, setSelectedGoals] = useState<GoalId[]>([]);
  const [selectedSolutions, setSelectedSolutions] = useState<SolutionId[]>([]);
  const [activePackageId, setActivePackageId] = useState<PackageId | null>(
    null,
  );
  const [metrics, setMetrics] = useState<BusinessMetrics>({ ...EMPTY_METRICS });
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadCta, setLeadCta] = useState("want_solution");
  const [calculatorStarted, setCalculatorStarted] = useState(false);

  useEffect(() => {
    track("catalog_opened");
  }, []);

  const changeStep = useCallback((next: CatalogStep) => {
    setStep(next);
    track("step_changed", { step: next });
    scrollToId("configurador");
  }, []);

  const startGuided = useCallback(() => {
    setStarted(true);
    setMode("guided");
    setStep("business");
    track("cta_clicked", { cta: "create_solution" });
    scrollToId("configurador");
  }, []);

  const startExplore = useCallback(() => {
    setStarted(true);
    setMode("explore");
    setStep("solutions");
    track("cta_clicked", { cta: "explore_solutions" });
    scrollToId("configurador");
  }, []);

  const setBusinessType = useCallback((id: BusinessTypeId) => {
    setBusinessTypeId(id);
    setStarted(true);
    setMode((current) => current ?? "guided");
    setMetrics({ ...EMPTY_METRICS });
    track("business_selected", { businessType: id });
    setStep("goals");
    track("step_changed", { step: "goals" });
    scrollToId("configurador");
  }, []);

  const toggleGoal = useCallback(
    (id: GoalId) => {
      const isSelected = selectedGoals.includes(id);
      const nextGoals = isSelected
        ? selectedGoals.filter((goal) => goal !== id)
        : [...selectedGoals, id];
      setSelectedGoals(nextGoals);
      track("goal_selected", { id, selected: !isSelected });

      const targets = getGoal(id).solutions;
      const rec = businessTypeId
        ? getRecommendations(businessTypeId).solutions
        : [];

      if (isSelected) {
        const remainingGoalSolutions = nextGoals.flatMap(
          (goalId) => getGoal(goalId).solutions,
        );
        setSelectedSolutions((current) =>
          enforceExclusiveGroups(
            current.filter((solutionId) => {
              if (!targets.includes(solutionId)) {
                return true;
              }
              return (
                rec.includes(solutionId) ||
                remainingGoalSolutions.includes(solutionId)
              );
            }),
          ),
        );
        setActivePackageId(null);
        return;
      }

      setSelectedSolutions((current) => {
        const next = enforceExclusiveGroups(
          uniqueIds([...current, ...targets]),
        );
        next
          .filter((solutionId) => !current.includes(solutionId))
          .forEach((solutionId) => {
            track("solution_selected", { id: solutionId, source: "goal" });
          });
        return next;
      });
      setActivePackageId(null);
    },
    [businessTypeId, selectedGoals],
  );

  const toggleSolution = useCallback((id: SolutionId) => {
    setActivePackageId(null);
    setSelectedSolutions((current) => {
      const isSelected = current.includes(id);
      const next = isSelected
        ? current.filter((solutionId) => solutionId !== id)
        : enforceExclusiveGroups([...current, id], id);
      track(isSelected ? "solution_removed" : "solution_selected", {
        id,
        kind: "solution",
      });
      return next;
    });
  }, []);

  const applyPackage = useCallback((id: PackageId) => {
    const solutions = applyPackageSolutions(id);
    setActivePackageId(id);
    setSelectedSolutions(solutions);
    setStarted(true);
    setMode((current) => current ?? "explore");
    track("package_selected", { id });
    solutions.forEach((solutionId) => {
      track("solution_selected", { id: solutionId, source: "package" });
    });
  }, []);

  const applyRecommended = useCallback(() => {
    if (!businessTypeId) {
      return;
    }
    const solutions = getRecommendations(businessTypeId).solutions;
    setSelectedSolutions(enforceExclusiveGroups(solutions));
    setActivePackageId(null);
    track("package_selected", { id: "recommended", businessType: businessTypeId });
  }, [businessTypeId]);

  const goToStep = useCallback(
    (next: CatalogStep) => {
      setStarted(true);
      changeStep(next);
    },
    [changeStep],
  );

  const openLead = useCallback((cta: string) => {
    setLeadCta(cta);
    setLeadOpen(true);
    track("cta_clicked", { cta });
  }, []);

  const continueFlow = useCallback(() => {
    if (step === "impact") {
      openLead("continue_proposal");
      return;
    }
    const next = nextStepAfter(step);
    if (next) {
      changeStep(next);
    }
  }, [changeStep, openLead, step]);

  const setMetric = useCallback(
    <K extends keyof BusinessMetrics>(key: K, value: BusinessMetrics[K]) => {
      setMetrics((current) => ({ ...current, [key]: value }));
      if (!calculatorStarted) {
        setCalculatorStarted(true);
        track("calculator_started");
      }
      track("calculator_completed", { field: String(key) });
    },
    [calculatorStarted],
  );

  const closeLead = useCallback(() => {
    setLeadOpen(false);
  }, []);

  const result = useMemo(
    () =>
      calculateSolution({
        businessType: businessTypeId,
        selectedGoals,
        selectedSolutions,
        metrics,
      }),
    [businessTypeId, selectedGoals, selectedSolutions, metrics],
  );

  const showBuilder = started;
  const showSummary =
    started &&
    (selectedSolutions.length > 0 ||
      step === "solutions" ||
      step === "investment" ||
      step === "impact");

  const canContinue =
    step === "business"
      ? Boolean(businessTypeId)
      : step === "solutions"
        ? selectedSolutions.length > 0
        : true;

  const continueLabel =
    step === "impact"
      ? "Solicitar propuesta"
      : step === "investment"
        ? "Ver el valor potencial"
        : "Continuar";

  const value = useMemo<CatalogContextValue>(
    () => ({
      started,
      mode,
      step,
      businessTypeId,
      selectedGoals,
      selectedSolutions,
      activePackageId,
      metrics,
      leadOpen,
      leadCta,
      result,
      showBuilder,
      showSummary,
      canContinue,
      continueLabel,
      startGuided,
      startExplore,
      setBusinessType,
      toggleGoal,
      toggleSolution,
      applyPackage,
      applyRecommended,
      goToStep,
      continueFlow,
      setMetric,
      openLead,
      closeLead,
      isRecommendedSolution: (id) =>
        isRecommendedForBusiness(businessTypeId, id),
      isGoalSolution: (id) => isSuggestedByGoals(selectedGoals, id),
    }),
    [
      started,
      mode,
      step,
      businessTypeId,
      selectedGoals,
      selectedSolutions,
      activePackageId,
      metrics,
      leadOpen,
      leadCta,
      result,
      showBuilder,
      showSummary,
      canContinue,
      continueLabel,
      startGuided,
      startExplore,
      setBusinessType,
      toggleGoal,
      toggleSolution,
      applyPackage,
      applyRecommended,
      goToStep,
      continueFlow,
      setMetric,
      openLead,
      closeLead,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return context;
}
