"use client";

import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { track } from "@/lib/local-catalog/analytics";
import { CATALOG_CONTACT } from "@/lib/local-catalog/catalog";
import { buildLeadPayload, buildWhatsAppText } from "@/lib/local-catalog/lead-payload";
import { saveCatalogSnapshot } from "@/lib/local-catalog/snapshot";
import { cn } from "@/lib/utils";

export function FinalCta() {
  const router = useRouter();
  const {
    openLead,
    businessTypeId,
    selectedGoals,
    selectedSolutions,
    metrics,
    result,
  } = useCatalog();

  function handleRegister() {
    saveCatalogSnapshot({
      businessType: businessTypeId,
      goals: selectedGoals,
      solutions: selectedSolutions,
      metrics,
      sourceCta: "register",
    });
    track("cta_clicked", { cta: "register" });
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
        <Button className="h-12 w-full px-5 sm:w-auto" onClick={handleRegister}>
          Crear mi cuenta con esta solución
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
    </section>
  );
}
