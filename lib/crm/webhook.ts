/**
 * Optional bridge to the internal CRM. When CRM_WEBHOOK_URL is not set,
 * this is a no-op, so the client system runs fully standalone.
 */
export async function notifyCrm(
  event: "catalog_lead" | "client_registered",
  payload: unknown,
): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) {
    return;
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-webhook-secret": process.env.CRM_WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify({ event, payload, sentAt: new Date().toISOString() }),
    });
  } catch (error) {
    console.error("[crm webhook] delivery failed", error);
  }
}
