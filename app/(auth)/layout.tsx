import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-[linear-gradient(to_bottom,#fafafa,#f4f4f5)]">
      <header className="border-b border-border/80 bg-background/90">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4">
          <Link href="/catalogo" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              FA
            </span>
            <span className="text-sm font-semibold tracking-tight">
              FreeAgents Local
            </span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
