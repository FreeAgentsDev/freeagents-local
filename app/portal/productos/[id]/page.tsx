import Link from "next/link";
import { notFound } from "next/navigation";

import { and, eq } from "drizzle-orm";

import { StatusBadge } from "@/components/portal/status-badge";
import { CatalogIcon } from "@/components/local-catalog/icon-map";
import { getUserOrganization, requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { entitlements } from "@/lib/db/schema";
import { getSolution } from "@/lib/local-catalog/catalog";
import { getEntitlementOnboarding } from "@/lib/portal/queries";
import { getProductModule, isProductId } from "@/lib/products/registry";

export default async function PortalProductPage({
  params,
}: PageProps<"/portal/productos/[id]">) {
  const { id } = await params;
  if (!isProductId(id)) {
    notFound();
  }

  const user = await requireUser();
  const membership = (await getUserOrganization(user.id))!;

  const [entitlement] = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.organizationId, membership.organization.id),
        eq(entitlements.productId, id),
      ),
    )
    .limit(1);

  if (!entitlement) {
    notFound();
  }

  const { product } = getProductModule(id);
  const solution = getSolution(id);
  const onboarding = await getEntitlementOnboarding(entitlement.id);
  const doneCount = onboarding.filter((item) => item.done).length;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/portal/productos"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Mis productos
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CatalogIcon name={product.icon} className="size-6" />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-white">
              {product.name}
            </h1>
            <p className="text-muted-foreground">{product.blurb}</p>
          </div>
          <StatusBadge status={entitlement.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-2xl border border-white/8 bg-card p-6">
          <h2 className="font-semibold tracking-tight">Activación</h2>
          {onboarding.length > 0 ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                {doneCount} de {onboarding.length} pasos completados. Nuestro
                equipo te acompaña en cada paso.
              </p>
              <ul className="mt-4 space-y-3">
                {onboarding.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 text-sm">
                    <span
                      className={
                        item.done
                          ? "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-300"
                          : "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-xs text-muted-foreground"
                      }
                    >
                      {item.done ? "✓" : item.position + 1}
                    </span>
                    <span
                      className={
                        item.done ? "text-muted-foreground line-through" : ""
                      }
                    >
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Sin pasos pendientes.
            </p>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/8 bg-card p-6">
            <h2 className="font-semibold tracking-tight">Qué incluye</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {solution.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            {solution.thirdPartyNote ? (
              <p className="mt-4 text-xs text-muted-foreground">
                {solution.thirdPartyNote}
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
