"use client";

import Image from "next/image";

import faLogo from "@/assets/brand/fa-logo.png";
import { buttonVariants } from "@/components/ui/button";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { CATALOG_CONTACT } from "@/lib/local-catalog/catalog";
import { cn } from "@/lib/utils";

export function PublicFooter() {
  const { openLead } = useCatalog();

  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 pb-24 sm:flex-row sm:items-center sm:justify-between lg:pb-8">
        <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Image
            src={faLogo}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
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
