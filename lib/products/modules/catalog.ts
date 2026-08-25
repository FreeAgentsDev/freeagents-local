import type { ProductModule } from "@/lib/products/types";

export const catalog: ProductModule = {
  product: {
    id: "catalog",
    name: "Catálogo Digital",
    category: "sales",
    icon: "book",
    provisioner: "hosted_module",
    blurb: "Tus productos con fotos y precios, listos para compartir por WhatsApp o QR.",
    onboarding: [
      "Enviar lista de productos o servicios con precios",
      "Enviar fotos de los productos",
      "Definir categorías",
      "Revisar tu catálogo publicado",
    ],
    worksWith: ["whatsapp", "store"],
  },
  provision: async () => "pending",
};
