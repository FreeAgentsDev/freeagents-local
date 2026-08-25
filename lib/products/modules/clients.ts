import type { ProductModule } from "@/lib/products/types";

export const clients: ProductModule = {
  product: {
    id: "clients",
    name: "Clientes",
    category: "customers",
    icon: "users",
    provisioner: "hosted_module",
    blurb: "Historial, última compra y quién dejó de venir, para recuperarlos.",
    onboarding: [
      "Importar base de clientes existente (si la hay)",
      "Definir etiquetas y segmentos",
      "Configurar alertas de clientes inactivos",
      "Capacitación de uso",
    ],
    worksWith: ["whatsapp", "dashboard"],
  },
  provision: async () => "pending",
};
