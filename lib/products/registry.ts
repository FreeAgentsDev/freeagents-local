import { automations } from "@/lib/products/modules/automations";
import { booking } from "@/lib/products/modules/booking";
import { catalog } from "@/lib/products/modules/catalog";
import { clients } from "@/lib/products/modules/clients";
import { custom } from "@/lib/products/modules/custom";
import { dashboard } from "@/lib/products/modules/dashboard";
import { digitalProfile } from "@/lib/products/modules/digital-profile";
import { inventory } from "@/lib/products/modules/inventory";
import { landing } from "@/lib/products/modules/landing";
import { pos } from "@/lib/products/modules/pos";
import { store } from "@/lib/products/modules/store";
import { website } from "@/lib/products/modules/website";
import { whatsapp } from "@/lib/products/modules/whatsapp";
import type {
  ProductDefinition,
  ProductId,
  ProductModule,
} from "@/lib/products/types";

const MODULES: ProductModule[] = [
  digitalProfile,
  landing,
  website,
  catalog,
  store,
  booking,
  inventory,
  pos,
  clients,
  whatsapp,
  automations,
  dashboard,
  custom,
];

export const PRODUCT_REGISTRY: Record<ProductId, ProductModule> =
  Object.fromEntries(MODULES.map((mod) => [mod.product.id, mod])) as Record<
    ProductId,
    ProductModule
  >;

export const PRODUCTS: ProductDefinition[] = MODULES.map((mod) => mod.product);

export function getProductModule(id: ProductId): ProductModule {
  const mod = PRODUCT_REGISTRY[id];
  if (!mod) {
    throw new Error(`Unknown product: ${id}`);
  }
  return mod;
}

export function isProductId(value: string): value is ProductId {
  return value in PRODUCT_REGISTRY;
}
