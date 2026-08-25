import type {
  BusinessMetrics,
  BusinessTypeId,
  GoalId,
  SolutionId,
} from "@/lib/local-catalog/types";

export type CatalogSnapshot = {
  businessType: BusinessTypeId | null;
  goals: GoalId[];
  solutions: SolutionId[];
  metrics: BusinessMetrics;
  sourceCta: string;
  savedAt: string;
};

const STORAGE_KEY = "fa-local:snapshot";

export function saveCatalogSnapshot(
  snapshot: Omit<CatalogSnapshot, "savedAt">,
): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...snapshot, savedAt: new Date().toISOString() }),
    );
  } catch {
    // Storage unavailable (private mode); registration still works without prefill.
  }
}

export function loadCatalogSnapshot(): CatalogSnapshot | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CatalogSnapshot;
    if (!Array.isArray(parsed.solutions)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearCatalogSnapshot(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
