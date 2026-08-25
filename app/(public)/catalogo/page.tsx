import type { Metadata } from "next";

import { CatalogBuilder } from "@/components/local-catalog/catalog-builder";

export const metadata: Metadata = {
  title: {
    absolute: "Construye el sistema digital de tu negocio | FreeAgents Local",
  },
  description:
    "Identifica tu negocio, elige qué mejorar y arma una solución con implementación, mensualidad y una estimación transparente de valor potencial.",
};

export default function CatalogoLocalPage() {
  return <CatalogBuilder />;
}
