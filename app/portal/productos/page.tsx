import Link from "next/link";

import { StatusBadge } from "@/components/portal/status-badge";
import { CatalogIcon } from "@/components/local-catalog/icon-map";
import { buttonVariants } from "@/components/ui/button";
import { getUserOrganization, requireUser } from "@/lib/auth/session";
import { getOrganizationEntitlements } from "@/lib/portal/queries";
import { getProductModule, isProductId } from "@/lib/products/registry";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Mis productos",
};

export default async function PortalProductsPage() {
  const user = await requireUser();
  const membership = (await getUserOrganization(user.id))!;

  const entitlementRows = await getOrganizationEntitlements(
    membership.organization.id,
  );

  const products = entitlementRows
    .filter((row) => isProductId(row.productId))
    .map((row) => ({
      entitlement: row,
      product: getProductModule(row.productId as never).product,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-black tracking-tight text-white">Mis productos</h1>
        <p className="mt-1 text-muted-foreground">
          Los productos de tu solución y el estado de activación de cada uno.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Aún no tienes productos. Arma tu solución en el catálogo.
          </p>
          <Link
            href="/catalogo"
            className={cn(buttonVariants(), "mt-4 h-11 px-5")}
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map(({ entitlement, product }) => (
            <Link
              key={entitlement.id}
              href={`/portal/productos/${product.id}`}
              className="group rounded-2xl border border-white/8 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(19,200,236,0.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CatalogIcon name={product.icon} className="size-5" />
                </span>
                <StatusBadge status={entitlement.status} />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight text-white group-hover:text-primary">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.blurb}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
