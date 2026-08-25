"use server";

import { z } from "zod";

import { notifyCrm } from "@/lib/crm/webhook";
import { db } from "@/lib/db";
import { catalogLeads } from "@/lib/db/schema";

const leadActionSchema = z.object({
  contact: z.object({
    name: z.string().min(2).max(80),
    business: z.string().min(2).max(120),
    whatsapp: z.string().min(7).max(20),
    email: z.string().email().max(120),
    city: z.string().min(2).max(80),
  }),
  sourceCta: z.string().max(40),
  payload: z.unknown(),
});

export type LeadActionInput = z.infer<typeof leadActionSchema>;

export async function createCatalogLead(
  input: LeadActionInput,
): Promise<{ ok: boolean }> {
  const parsed = leadActionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false };
  }

  const { contact, sourceCta, payload } = parsed.data;

  await db.insert(catalogLeads).values({
    name: contact.name,
    business: contact.business,
    whatsapp: contact.whatsapp,
    email: contact.email,
    city: contact.city,
    sourceCta,
    payload: payload ?? {},
  });

  void notifyCrm("catalog_lead", { contact, sourceCta, payload });

  return { ok: true };
}
