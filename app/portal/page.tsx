import Link from "next/link";

import { StatusBadge } from "@/components/portal/status-badge";
import { CatalogIcon } from "@/components/local-catalog/icon-map";
import { buttonVariants } from "@/components/ui/button";
import { getUserOrganization, requireUser } from "@/lib/auth/session";
import {
  formatMonthlyTotal,
  formatSetupTotal,
} from "@/lib/local-catalog/pricing";
import {
  getLatestQuote,
  getOrganizationEntitlements,
} from "@/lib/portal/queries";
import { getProductModule, isProductId } from "@/lib/products/registry";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Portal",
};

export default async function PortalHomePage() {
  const user = await requireUser();
  const membership = (await getUserOrganization(user.id))!;
  const organization = membership.organization;

  const [entitlementRows, quote] = await Promise.all([
    getOrganizationEntitlements(organization.id),
    getLatestQuote(organization.id),
  ]);

  const products = entitlementRows
    .filter((row) => isProductId(row.productId))
    .map((row) => ({
      entitlement: row,
      product: getProductModule(row.productId as never).product,
    }));

  const pendingCount = products.filter(
    (item) => item.entitlement.status !== "active",
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hola, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Este es el portal de {organization.name}.
          {pendingCount > 0
            ? ` Tienes ${pendingCount} ${pendingCount === 1 ? "producto" : "productos"} en proceso de activación.`
            : products.length > 0
              ? " Todos tus productos están activos."
              : ""}
        </p>
      </div>

      {quote ? (
        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Tu inversión
          </p>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Implementación</dt>
              <dd className="text-xl font-semibold">
                {formatSetupTotal(quote.setupPrice, quote.isSetupFrom)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Mensualidad</dt>
              <dd className="text-xl font-semibold">
                {formatMonthlyTotal(quote.monthlyPrice, quote.isMonthlyFrom)}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Tus productos
          </h2>
          <Link
            href="/portal/productos"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-background p-8 text-center">
            <p className="text-muted-foreground">
              Aún no tienes productos en tu solución.
            </p>
            <Link
              href="/catalogo"
              className={cn(buttonVariants(), "mt-4 h-11 px-5")}
            >
              Armar mi solución
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(({ entitlement, product }) => (
              <Link
                key={entitlement.id}
                href={`/portal/productos/${product.id}`}
                className="group rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CatalogIcon name={product.icon} className="size-5" />
                  </span>
                  <StatusBadge status={entitlement.status} />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight group-hover:text-primary">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.blurb}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
