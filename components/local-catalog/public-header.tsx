"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { CATALOG_CONTACT } from "@/lib/local-catalog/catalog";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const { openLead } = useCatalog();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
        >
          Saltar al contenido
        </Link>
        <Link
          href="/catalogo"
          className="flex items-center gap-2 rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            FA
          </span>
          <span className="text-sm font-semibold tracking-tight">
            FreeAgents Local
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {CATALOG_CONTACT.whatsappUrl ? (
            <a
              href={CATALOG_CONTACT.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Hablar con un asesor
            </a>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openLead("header_advisor")}
            >
              Hablar con un asesor
            </Button>
          )}
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}
