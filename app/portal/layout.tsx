import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { SignOutButton } from "@/components/portal/sign-out-button";
import { getUserOrganization, requireUser } from "@/lib/auth/session";

const NAV_ITEMS = [
  { href: "/portal", label: "Inicio" },
  { href: "/portal/productos", label: "Mis productos" },
  { href: "/portal/cuenta", label: "Cuenta" },
] as const;

export default async function PortalLayout({ children }: LayoutProps<"/portal">) {
  const user = await requireUser();
  const membership = await getUserOrganization(user.id);

  if (!membership) {
    redirect("/register");
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-6">
            <BrandMark href="/portal" label={membership.organization.name} />
            <span className="hidden truncate text-sm text-slate-400 sm:inline">
              {membership.organization.name}
            </span>
            <nav className="flex items-center gap-1" aria-label="Portal">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-white/5">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <p className="text-sm text-slate-500">
            FreeAgents Local · Estamos contigo en la activación de tu solución
          </p>
        </div>
      </footer>
    </div>
  );
}
