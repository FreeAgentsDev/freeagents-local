import Link from "next/link";
import { redirect } from "next/navigation";

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
    // Account exists but registration never finished: send back to complete it.
    redirect("/register");
  }

  return (
    <div className="flex min-h-svh flex-col bg-[linear-gradient(to_bottom,#fafafa,#f4f4f5)]">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link href="/portal" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                FA
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                {membership.organization.name}
              </span>
            </Link>
            <nav className="flex items-center gap-1" aria-label="Portal">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
      <footer className="border-t border-border bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <p className="text-sm text-muted-foreground">
            FreeAgents Local · Estamos contigo en la activación de tu solución
          </p>
        </div>
      </footer>
    </div>
  );
}
