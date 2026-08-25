import type { ProductModule } from "@/lib/products/types";

export const dashboard: ProductModule = {
  product: {
    id: "dashboard",
    name: "Números de tu negocio",
    category: "management",
    icon: "chart",
    provisioner: "hosted_module",
    blurb: "Ventas, clientes y utilidad aproximada, sin armar reportes a mano.",
    onboarding: [
      "Conectar las fuentes de datos (caja, reservas, tienda)",
      "Definir métricas prioritarias",
      "Revisión del primer reporte contigo",
    ],
    worksWith: ["pos", "clients"],
  },
  provision: async () => "pending",
};
