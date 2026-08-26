"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { authClient } from "@/lib/auth/client";
import { track } from "@/lib/local-catalog/analytics";
import { CATALOG_CONTACT } from "@/lib/local-catalog/catalog";
import { buildLeadPayload, buildWhatsAppText } from "@/lib/local-catalog/lead-payload";
import {
  clearCatalogSnapshot,
  saveCatalogSnapshot,
} from "@/lib/local-catalog/snapshot";
import { applyCatalogSnapshot } from "@/lib/registration/actions";
import { cn } from "@/lib/utils";

export function FinalCta() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    openLead,
    businessTypeId,
    selectedGoals,
    selectedSolutions,
    metrics,
    result,
  } = useCatalog();

  async function handleRegister() {
    const snapshot = {
      businessType: businessTypeId,
      goals: selectedGoals,
      solutions: selectedSolutions,
      metrics,
      sourceCta: "register" as const,
    };
    saveCatalogSnapshot(snapshot);
    track("cta_clicked", { cta: "register" });
    setError(null);

    if (session) {
      setActivating(true);
      try {
        const applied = await applyCatalogSnapshot({ snapshot });
        if (applied.ok) {
          clearCatalogSnapshot();
          toast.success("Tu solución quedó en tu portal.");
          router.push("/portal");
          router.refresh();
          return;
        }
        if (applied.code === "NO_ORG" || applied.code === "NO_SESSION") {
          router.push("/register");
          return;
        }
        setError(applied.error);
      } finally {
        setActivating(false);
      }
      return;
    }

    router.push("/register");
  }

  function handleWhatsApp() {
    if (!CATALOG_CONTACT.whatsappUrl) {
      openLead("whatsapp");
      return;
    }

    const payload = buildLeadPayload({
      contact: {
        name: "",
        business: "",
        whatsapp: "",
        email: "",
        city: "",
      },
      businessType: businessTypeId,
      selectedGoals,
      selectedSolutions,
      metrics,
      result,
      sourceCta: "whatsapp",
    });

    const url = new URL(CATALOG_CONTACT.whatsappUrl);
    url.searchParams.set("text", buildWhatsAppText(payload));
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="contacto"
      className="scroll-mt-24 rounded-2xl border border-white/8 bg-card/60 bg-[radial-gradient(ellipse_at_top,_rgba(19,200,236,0.12),_transparent_60%)] px-5 py-10 text-center sm:px-8"
    >
      <h2 className="font-heading text-3xl font-black tracking-tight text-balance text-white">
        ¿Quieres construir esto para tu negocio?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        Cuéntanos sobre tu negocio y te ayudamos a convertir esta configuración
        en una solución real.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        <Button
          className="h-12 w-full px-5 sm:w-auto"
          onClick={handleRegister}
          disabled={activating}
        >
          {activating
            ? "Activando…"
            : session
              ? "Activar esta solución en mi cuenta"
              : "Crear mi cuenta con esta solución"}
        </Button>
        {CATALOG_CONTACT.whatsappUrl ? (
          <a
            href={CATALOG_CONTACT.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "h-12 w-full px-5 sm:w-auto")}
            onClick={(event) => {
              event.preventDefault();
              handleWhatsApp();
            }}
          >
            Hablar por WhatsApp
          </a>
        ) : (
          <Button
            variant="outline"
            className="h-12 w-full px-5 sm:w-auto"
            onClick={() => openLead("whatsapp")}
          >
            Hablar por WhatsApp
          </Button>
        )}
        <Button
          variant="outline"
          className="h-12 w-full px-5 sm:w-auto"
          onClick={() => openLead("schedule_call")}
        >
          Agendar una llamada
        </Button>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
