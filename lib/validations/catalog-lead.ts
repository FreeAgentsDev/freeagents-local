import { z } from "zod";

export const catalogLeadSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre").max(120),
  business: z.string().trim().min(2, "Ingresa el nombre de tu negocio").max(160),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Ingresa un WhatsApp válido")
    .max(20, "Ingresa un WhatsApp válido")
    .regex(/^[+\d\s()-]+$/, "Usa solo números y símbolos de teléfono"),
  email: z.string().trim().email("Ingresa un correo válido").max(160),
  city: z.string().trim().min(2, "Ingresa tu ciudad").max(80),
});

export type CatalogLeadInput = z.infer<typeof catalogLeadSchema>;
