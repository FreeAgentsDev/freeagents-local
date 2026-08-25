import type { ProductModule } from "@/lib/products/types";

export const automations: ProductModule = {
  product: {
    id: "automations",
    name: "Automatizaciones",
    category: "automation",
    icon: "zap",
    provisioner: "integration",
    blurb: "Reglas simples: si pasa algo, el sistema actúa por ti.",
    onboarding: [
      "Identificar tareas repetitivas a automatizar",
      "Definir reglas (ej: nueva reserva → WhatsApp)",
      "Activar y probar cada automatización",
    ],
    worksWith: ["booking", "whatsapp", "inventory"],
  },
  provision: async () => "pending",
};
