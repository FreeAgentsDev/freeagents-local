import type {
  BusinessType,
  BusinessTypeId,
  Recommendation,
} from "@/lib/local-catalog/types";

export const BUSINESS_TYPES: BusinessType[] = [
  {
    id: "restaurant",
    name: "Restaurante",
    description: "Pedidos, carta y operación del día.",
    icon: "utensils",
    featured: true,
  },
  {
    id: "barbershop",
    name: "Barbería",
    description: "Citas, clientes y WhatsApp.",
    icon: "scissors",
    featured: true,
  },
  {
    id: "beauty_salon",
    name: "Salón / Estética",
    description: "Agenda, clientes y seguimiento.",
    icon: "sparkles",
    featured: true,
  },
  {
    id: "boutique",
    name: "Boutique / Tienda",
    description: "Catálogo, inventario y ventas.",
    icon: "shirt",
    featured: true,
  },
  {
    id: "veterinary",
    name: "Veterinaria",
    description: "Citas, pacientes y recordatorios.",
    icon: "paw",
    featured: true,
  },
  {
    id: "workshop",
    name: "Taller",
    description: "Órdenes, clientes e inventario.",
    icon: "wrench",
    featured: true,
  },
  {
    id: "hotel",
    name: "Hotel / Hospedaje",
    description: "Reservas, huéspedes y operación.",
    icon: "hotel",
    featured: true,
  },
  {
    id: "academy",
    name: "Academia",
    description: "Clases, alumnos y seguimiento.",
    icon: "graduation",
    featured: true,
  },
  {
    id: "independent",
    name: "Servicios profesionales",
    description: "Presencia, agenda y clientes.",
    icon: "briefcase",
    featured: true,
  },
  {
    id: "other",
    name: "Otro",
    description: "Armamos el sistema a tu medida.",
    icon: "store",
    featured: true,
  },
  {
    id: "clinic",
    name: "Consultorio",
    description: "Agenda, pacientes y comunicación.",
    icon: "stethoscope",
  },
  {
    id: "gym",
    name: "Gimnasio",
    description: "Clases, miembros y renovaciones.",
    icon: "dumbbell",
  },
  {
    id: "trainer",
    name: "Entrenador / instructor",
    description: "Sesiones, clientes y presencia.",
    icon: "trophy",
  },
  {
    id: "retail_store",
    name: "Tienda de productos",
    description: "Inventario, ventas y recompra.",
    icon: "shopping-bag",
  },
];

export const RECOMMENDATIONS: Record<BusinessTypeId, Recommendation> = {
  barbershop: {
    solutions: ["booking", "clients", "whatsapp", "landing", "automations"],
  },
  beauty_salon: {
    solutions: ["booking", "clients", "whatsapp", "landing", "automations"],
  },
  veterinary: {
    solutions: ["booking", "clients", "whatsapp", "landing"],
  },
  clinic: {
    solutions: ["booking", "clients", "whatsapp", "landing"],
  },
  gym: {
    solutions: ["booking", "clients", "whatsapp", "landing"],
  },
  trainer: {
    solutions: ["booking", "clients", "whatsapp", "digital_profile"],
  },
  restaurant: {
    solutions: ["catalog", "store", "clients", "pos", "inventory", "dashboard"],
  },
  boutique: {
    solutions: ["catalog", "store", "inventory", "clients", "whatsapp", "dashboard"],
  },
  retail_store: {
    solutions: ["catalog", "store", "inventory", "clients", "whatsapp", "dashboard"],
  },
  workshop: {
    solutions: ["pos", "inventory", "clients", "whatsapp", "dashboard"],
  },
  hotel: {
    solutions: ["booking", "clients", "whatsapp", "website", "dashboard"],
  },
  academy: {
    solutions: ["booking", "clients", "whatsapp", "landing"],
  },
  independent: {
    solutions: ["booking", "clients", "whatsapp", "landing"],
  },
  other: {
    solutions: ["digital_profile", "clients", "whatsapp"],
  },
};
