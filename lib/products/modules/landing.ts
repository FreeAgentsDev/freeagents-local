import type { ProductModule } from "@/lib/products/types";

export const landing: ProductModule = {
  product: {
    id: "landing",
    name: "Landing Local",
    category: "presence",
    icon: "layout",
    provisioner: "site",
    blurb: "Una página profesional para presentar tu negocio y recibir clientes.",
    onboarding: [
      "Enviar información del negocio y servicios",
      "Enviar logo, fotos y colores de marca",
      "Definir dominio (o usar uno provisto)",
      "Revisar el diseño propuesto",
      "Aprobar y publicar",
    ],
    worksWith: ["booking", "whatsapp"],
  },
  provision: async () => "pending",
};
