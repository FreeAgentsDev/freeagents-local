"use client";

import { buttonVariants } from "@/components/ui/button";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { CATALOG_CONTACT } from "@/lib/local-catalog/catalog";
import { cn } from "@/lib/utils";

export function PublicFooter() {
  const { openLead } = useCatalog();

  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 pb-24 sm:flex-row sm:items-center sm:justify-between lg:pb-8">
        <p className="text-sm text-muted-foreground">
          FreeAgents Local · Tecnología para el comercio local
        </p>
        {CATALOG_CONTACT.whatsappUrl ? (
          <a
            href={CATALOG_CONTACT.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "link" }))}
          >
            Hablar con un asesor
          </a>
        ) : (
          <button
            type="button"
            className={cn(buttonVariants({ variant: "link" }))}
            onClick={() => openLead("footer_advisor")}
          >
            Hablar con un asesor
          </button>
        )}
      </div>
    </footer>
  );
}
