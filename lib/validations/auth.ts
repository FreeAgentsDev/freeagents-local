import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  business: z.string().min(2, "Ingresa el nombre de tu negocio"),
  whatsapp: z
    .string()
    .min(7, "Ingresa un WhatsApp válido")
    .regex(/^[+\d][\d\s-]{6,17}$/, "Ingresa un WhatsApp válido"),
  email: z.string().email("Ingresa un email válido"),
  city: z.string().min(2, "Ingresa tu ciudad"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
