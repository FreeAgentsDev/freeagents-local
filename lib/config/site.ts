/** Canonical public hosts. Apex stays on the marketing landing. */
export const LANDING_URL = "https://freeagentsdev.com";
export const PRODUCTION_APP_HOST = "local.freeagentsdev.com";
export const PRODUCTION_APP_URL = `https://${PRODUCTION_APP_HOST}`;

export function getAppUrl() {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_ENV === "production") {
    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    return productionHost
      ? `https://${productionHost}`
      : PRODUCTION_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function getTrustedOrigins() {
  const origins = new Set([
    getAppUrl(),
    PRODUCTION_APP_URL,
    LANDING_URL,
    "https://www.freeagentsdev.com",
  ]);

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  return [...origins];
}
