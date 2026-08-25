"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCatalog } from "@/components/local-catalog/catalog-provider";
import { createCatalogLead } from "@/lib/local-catalog/actions";
import { track } from "@/lib/local-catalog/analytics";
import { getBusinessType } from "@/lib/local-catalog/catalog";
import { buildLeadPayload } from "@/lib/local-catalog/lead-payload";
import {
  formatMonthlyTotal,
  formatSetupTotal,
  formatCopPerMonth,
} from "@/lib/local-catalog/pricing";
import {
  catalogLeadSchema,
  type CatalogLeadInput,
} from "@/lib/validations/catalog-lead";

const CTA_COPY: Record<string, { title: string; description: string }> = {
  proposal: {
    title: "Solicitar propuesta",
    description:
      "Déjanos tus datos. Ya llevamos la configuración para convertirla en una propuesta real.",
  },
  whatsapp: {
    title: "Hablar por WhatsApp",
    description:
      "Déjanos tu número y el resumen de lo que armaste. Te escribimos por WhatsApp.",
  },
  schedule_call: {
    title: "Agendar una llamada",
    description:
      "Cuéntanos cómo contactarte y coordinamos una llamada con esta configuración.",
  },
  want_solution: {
    title: "Quiero esta solución",
    description:
      "Déjanos tus datos. Ya llevamos el resumen de lo que armaste para que no tengas que explicarlo otra vez.",
  },
};

export function LeadDialog() {
  const {
    leadOpen,
    closeLead,
    leadCta,
    result,
    businessTypeId,
    selectedGoals,
    selectedSolutions,
    metrics,
  } = useCatalog();

  const form = useForm<CatalogLeadInput>({
    resolver: zodResolver(catalogLeadSchema),
    defaultValues: {
      name: "",
      business: "",
      whatsapp: "",
      email: "",
      city: "",
    },
  });

  const businessLabel = businessTypeId
    ? getBusinessType(businessTypeId).name
    : "Sin definir";
  const copy = CTA_COPY[leadCta] ?? CTA_COPY.want_solution;

  async function onSubmit(values: CatalogLeadInput) {
    const payload = buildLeadPayload({
      contact: values,
      businessType: businessTypeId,
      selectedGoals,
      selectedSolutions,
      metrics,
      result,
      sourceCta: leadCta,
    });

    const { ok } = await createCatalogLead({
      contact: values,
      sourceCta: leadCta,
      payload,
    });

    if (!ok) {
      toast.error("No pudimos enviar tu configuración. Intenta de nuevo.");
      return;
    }

    track("lead_submitted", {
      businessType: businessTypeId,
      monthlyPrice: result.monthlyPrice,
      setupPrice: result.setupPrice,
      solutions: result.includedLabels,
      cta: leadCta,
    });

    toast.success("Recibimos tu configuración. Te contactaremos pronto.");
    form.reset();
    closeLead();
  }

  return (
    <Dialog open={leadOpen} onOpenChange={(open) => !open && closeLead()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl bg-muted/60 p-4 text-sm">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Resumen automático
          </p>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Tipo de negocio</dt>
              <dd className="font-medium">{businessLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Solución</dt>
              <dd className="text-right font-medium">
                {result.includedLabels.join(" + ") || "Por definir"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Implementación</dt>
              <dd className="font-medium">
                {formatSetupTotal(result.setupPrice, result.isSetupFrom)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Mensualidad</dt>
              <dd className="font-medium">
                {formatMonthlyTotal(result.monthlyPrice, result.isMonthlyFrom)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Valor potencial estimado</dt>
              <dd className="font-medium">
                {result.impact.hasMonetaryEstimate
                  ? formatCopPerMonth(
                      (result.impact.recoverableRevenue ?? 0) +
                        (result.impact.timeValuePerMonth ?? 0),
                    )
                  : "Sin cifra monetaria"}
              </dd>
            </div>
          </dl>
        </div>

        <Separator />

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field
            id="lead-name"
            label="Nombre"
            error={form.formState.errors.name?.message}
          >
            <Input
              id="lead-name"
              autoComplete="name"
              className="h-11"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
          </Field>
          <Field
            id="lead-business"
            label="Negocio"
            error={form.formState.errors.business?.message}
          >
            <Input
              id="lead-business"
              autoComplete="organization"
              className="h-11"
              aria-invalid={Boolean(form.formState.errors.business)}
              {...form.register("business")}
            />
          </Field>
          <Field
            id="lead-whatsapp"
            label="WhatsApp"
            error={form.formState.errors.whatsapp?.message}
          >
            <Input
              id="lead-whatsapp"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              className="h-11"
              aria-invalid={Boolean(form.formState.errors.whatsapp)}
              {...form.register("whatsapp")}
            />
          </Field>
          <Field
            id="lead-email"
            label="Email"
            error={form.formState.errors.email?.message}
          >
            <Input
              id="lead-email"
              type="email"
              autoComplete="email"
              className="h-11"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
          </Field>
          <Field
            id="lead-city"
            label="Ciudad"
            error={form.formState.errors.city?.message}
          >
            <Input
              id="lead-city"
              autoComplete="address-level2"
              className="h-11"
              aria-invalid={Boolean(form.formState.errors.city)}
              {...form.register("city")}
            />
          </Field>
          <Button
            type="submit"
            className="h-12 w-full"
            disabled={form.formState.isSubmitting}
          >
            Enviar mi configuración
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
