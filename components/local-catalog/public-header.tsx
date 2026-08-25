"use client";

import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { CATALOG_CONTACT } from "@/lib/local-catalog/catalog";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const { openLead } = useCatalog();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
        >
          Saltar al contenido
        </Link>
        <BrandMark />
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
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-slate-300 hover:text-white",
            )}
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}
