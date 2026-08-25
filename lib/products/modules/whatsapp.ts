import type { ProductModule } from "@/lib/products/types";

export const whatsapp: ProductModule = {
  product: {
    id: "whatsapp",
    name: "WhatsApp",
    category: "automation",
    icon: "message",
    provisioner: "integration",
    blurb: "Bienvenida, horarios, seguimiento y recuperación desde el chat que ya usas.",
    onboarding: [
      "Conectar número de WhatsApp del negocio",
      "Definir mensajes de bienvenida y preguntas frecuentes",
      "Configurar seguimientos automáticos",
      "Probar el flujo completo",
    ],
    worksWith: ["booking", "clients", "catalog"],
  },
  provision: async () => "pending",
};
