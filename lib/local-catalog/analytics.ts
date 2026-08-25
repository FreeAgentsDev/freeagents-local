export type CatalogEventName =
  | "catalog_opened"
  | "business_selected"
  | "goal_selected"
  | "package_selected"
  | "solution_selected"
  | "solution_removed"
  | "step_changed"
  | "calculator_started"
  | "calculator_completed"
  | "cta_clicked"
  | "lead_submitted";

export type CatalogEventPayload = Record<
  string,
  string | number | boolean | string[] | null | undefined
>;

type AnalyticsSink = (
  event: CatalogEventName,
  payload?: CatalogEventPayload,
) => void;

let sink: AnalyticsSink = (event, payload) => {
  if (process.env.NODE_ENV === "development") {
    console.debug("[catalog]", event, payload ?? {});
  }
};

export function setCatalogAnalyticsSink(next: AnalyticsSink) {
  sink = next;
}

export function track(
  event: CatalogEventName,
  payload?: CatalogEventPayload,
) {
  sink(event, payload);
}
