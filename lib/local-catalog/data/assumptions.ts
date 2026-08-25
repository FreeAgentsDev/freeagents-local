/**
 * Conservative commercial assumptions for potential-value estimates.
 * Change these values without touching the UI.
 */
export const IMPACT_ASSUMPTIONS = {
  /** Share of monthly sales treated as potentially recoverable via better follow-up. */
  crmRecoveryRate: 0.03,
  /** Share of weekly admin time a booking system could free. */
  bookingTimeReduction: 0.35,
  /** Extra sales opportunity from showing products digitally. Very conservative. */
  catalogOpportunityRate: 0.02,
  weeksPerMonth: 4,
} as const;
