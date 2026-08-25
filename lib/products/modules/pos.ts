import type { ProductModule } from "@/lib/products/types";

export const pos: ProductModule = {
  product: {
    id: "pos",
    name: "Caja y ventas",
    category: "operations",
    icon: "wallet",
    provisioner: "hosted_module",
    blurb: "Registra ventas, cobra y mira el movimiento del día sin Excel paralelo.",
    onboarding: [
      "Cargar productos y precios",
      "Definir métodos de pago",
      "Crear usuarios del equipo",
      "Capacitación de caja y cierre diario",
    ],
    worksWith: ["inventory", "dashboard"],
  },
  provision: async () => "pending",
};
