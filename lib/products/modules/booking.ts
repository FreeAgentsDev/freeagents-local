import type { ProductModule } from "@/lib/products/types";

export const booking: ProductModule = {
  product: {
    id: "booking",
    name: "Agenda / Reservas",
    category: "operations",
    icon: "calendar",
    provisioner: "hosted_module",
    blurb: "Tus clientes reservan solos y el sistema envía recordatorios.",
    onboarding: [
      "Definir servicios y duraciones",
      "Definir horarios y disponibilidad",
      "Configurar recordatorios",
      "Probar una reserva de extremo a extremo",
    ],
    worksWith: ["whatsapp", "clients"],
  },
  provision: async () => "pending",
};
