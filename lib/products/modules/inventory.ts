import type { ProductModule } from "@/lib/products/types";

export const inventory: ProductModule = {
  product: {
    id: "inventory",
    name: "Inventario",
    category: "operations",
    icon: "package",
    provisioner: "hosted_module",
    blurb: "Stock, entradas, salidas y alertas de productos que se agotan.",
    onboarding: [
      "Enviar inventario inicial (productos y cantidades)",
      "Definir alertas de stock mínimo",
      "Registrar proveedores principales",
      "Capacitación de uso diario",
    ],
    worksWith: ["pos", "store"],
  },
  provision: async () => "pending",
};
