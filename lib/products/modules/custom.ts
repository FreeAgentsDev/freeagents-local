import type { ProductModule } from "@/lib/products/types";

export const custom: ProductModule = {
  product: {
    id: "custom",
    name: "Solución a medida",
    category: "custom",
    icon: "sliders",
    provisioner: "service",
    blurb: "Diseñamos y construimos una solución específica para tu operación.",
    onboarding: [
      "Sesión de descubrimiento con el equipo FreeAgents",
      "Propuesta de alcance y tiempos",
      "Aprobación de la propuesta",
      "Desarrollo e iteraciones",
      "Entrega y capacitación",
    ],
  },
  provision: async () => "pending",
};
