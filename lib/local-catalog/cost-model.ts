/**
 * Internal cost model for FreeAgents Local.
 * Not used by the public UI. Recalculate catalog prices from here.
 *
 * Sources (ago 2026):
 * - TRM: Banco de la República, vigencia 18 ago 2026
 * - Vercel Pro, Supabase Pro, Resend, Cloudflare R2, OpenAI, Meta WhatsApp, Wompi
 * - AgendaPro CO public plans (agendapro.com/co/planes)
 */

export const COST_MODEL_AS_OF = "2026-08-18";

/** TRM COP per 1 USD, 18 ago 2026. */
export const TRM_COP_PER_USD = 3_128.65;

export function usdToCop(usd: number): number {
  return Math.round(usd * TRM_COP_PER_USD);
}

export const PLATFORM_USD = {
  vercelPro: 20,
  supabasePro: 25,
  resendPro: 20,
} as const;

/** Shared platform at 50 paying tenants. Infra is amortized, not billed per client. */
export const ASSUMED_PAYING_TENANTS = 50;

export const PLATFORM_SHARED_COP_PER_MONTH =
  usdToCop(PLATFORM_USD.vercelPro + PLATFORM_USD.supabasePro);

export const PLATFORM_COP_PER_TENANT_AT_SCALE = Math.round(
  PLATFORM_SHARED_COP_PER_MONTH / ASSUMED_PAYING_TENANTS,
);

/**
 * Meta WhatsApp Cloud API — Colombia, per delivered template message.
 * Utility templates inside a 24h customer service window are free.
 */
export const WHATSAPP_META_USD = {
  marketingPerMessage: 0.0125,
  utilityPerMessage: 0.0008,
} as const;

export const WHATSAPP_META_COP = {
  marketingPerMessage: usdToCop(WHATSAPP_META_USD.marketingPerMessage),
  utilityPerMessage: usdToCop(WHATSAPP_META_USD.utilityPerMessage),
} as const;

/** Included marketing templates in the WhatsApp avanzado add-on. Utility is nearly free. */
export const WHATSAPP_ADVANCED_INCLUDED_MARKETING_MESSAGES = 200;

export const OPENAI_GPT4O_MINI_USD = {
  inputPer1M: 0.15,
  outputPer1M: 0.6,
} as const;

/** Wompi Plan Avanzado — charged to the merchant, not FreeAgents. */
export const WOMPI = {
  percent: 2.65,
  fixedCop: 700,
  ivaPercent: 19,
} as const;

/** Fully loaded onboarding hour in COP (ops/freelance, conservative). */
export const SETUP_HOUR_COP = 40_000;

export const SETUP_HOURS = {
  entry: 0,
  essential: 3,
  scale: 5,
  business: 7,
} as const;

export const SETUP_LABOR_COP = {
  entry: 0,
  essential: SETUP_HOUR_COP * SETUP_HOURS.essential,
  scale: SETUP_HOUR_COP * SETUP_HOURS.scale,
  business: SETUP_HOUR_COP * SETUP_HOURS.business,
} as const;

export const MARKET_AGENDAPRO_COP = {
  individual: 50_000,
  basico: 99_000,
  premium: 150_000,
  pro: 510_000,
  whatsapp50Messages: 10_000,
} as const;

export function estimateWhatsAppUtilityCop(chargedRemindersPerMonth: number): number {
  return chargedRemindersPerMonth * WHATSAPP_META_COP.utilityPerMessage;
}

export function estimateAiCop(monthlyThreads: number, inputTokens = 800, outputTokens = 400): number {
  const inputUsd = (monthlyThreads * inputTokens * OPENAI_GPT4O_MINI_USD.inputPer1M) / 1_000_000;
  const outputUsd = (monthlyThreads * outputTokens * OPENAI_GPT4O_MINI_USD.outputPer1M) / 1_000_000;
  return usdToCop(inputUsd + outputUsd);
}
