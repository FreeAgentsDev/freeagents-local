import type { ProductModule } from "@/lib/products/types";

export const website: ProductModule = {
  product: {
    id: "website",
    name: "Web Profesional",
    category: "presence",
    icon: "globe",
    provisioner: "site",
    blurb: "Un sitio completo, hasta 7 secciones, con contenidos que tú actualizas.",
    onboarding: [
      "Definir estructura de secciones",
      "Enviar contenidos y material de marca",
      "Definir dominio",
      "Revisar el diseño propuesto",
      "Capacitación para actualizar contenidos",
      "Aprobar y publicar",
    ],
    worksWith: ["catalog", "automations"],
  },
  provision: async () => "pending",
};
