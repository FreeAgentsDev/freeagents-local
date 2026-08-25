import type { ProductModule } from "@/lib/products/types";

export const store: ProductModule = {
  product: {
    id: "store",
    name: "Tienda Online",
    category: "sales",
    icon: "store",
    provisioner: "site",
    blurb: "Catálogo, carrito y pedidos ordenados con panel de administración.",
    onboarding: [
      "Enviar productos, precios y fotos",
      "Definir zonas y costos de envío",
      "Configurar métodos de pago (pasarela a cargo del cliente)",
      "Revisar la tienda en ambiente de prueba",
      "Capacitación del panel administrativo",
      "Aprobar y publicar",
    ],
    worksWith: ["inventory", "whatsapp"],
  },
  provision: async () => "pending",
};
