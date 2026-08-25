import type { Goal } from "@/lib/local-catalog/types";

export const GOALS: Goal[] = [
  {
    id: "sell_more",
    title: "Quiero vender más",
    description: "Muéstrale a tus clientes lo que ofreces y conviértelo en ventas.",
    icon: "dollar",
    solutions: ["catalog", "store", "whatsapp", "clients", "automations"],
  },
  {
    id: "save_time",
    title: "Quiero ahorrar tiempo",
    description: "Deja que las reservas, mensajes y tareas repetitivas se ordenen solas.",
    icon: "clock",
    solutions: ["booking", "automations", "whatsapp", "pos"],
  },
  {
    id: "organize",
    title: "Quiero organizar mi negocio",
    description: "Controla inventario, caja y números del día a día.",
    icon: "package",
    solutions: ["inventory", "pos", "dashboard"],
  },
  {
    id: "know_customers",
    title: "Quiero conocer mejor a mis clientes",
    description: "Conoce y recupera a las personas que ya te compran.",
    icon: "users",
    solutions: ["clients", "whatsapp", "dashboard"],
  },
  {
    id: "digital_presence",
    title: "Quiero tener presencia digital",
    description: "Que te encuentren fácil: perfil, página o web profesional.",
    icon: "globe",
    solutions: ["digital_profile", "landing", "website"],
  },
  {
    id: "custom",
    title: "Necesito algo personalizado",
    description: "Si no está en el catálogo, lo diseñamos contigo.",
    icon: "sliders",
    solutions: ["custom"],
  },
];
