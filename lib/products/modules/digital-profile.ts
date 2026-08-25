import type { ProductModule } from "@/lib/products/types";

export const digitalProfile: ProductModule = {
  product: {
    id: "digital_profile",
    name: "Perfil Digital",
    category: "presence",
    icon: "qr",
    provisioner: "site",
    blurb: "Tu negocio con link propio, QR y datos de contacto siempre al día.",
    onboarding: [
      "Enviar información del negocio (nombre, horarios, dirección)",
      "Enviar logo y fotos",
      "Confirmar servicios o productos a mostrar",
      "Revisar y aprobar tu perfil publicado",
    ],
    worksWith: ["whatsapp"],
  },
  provision: async () => "pending",
};
