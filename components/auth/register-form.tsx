"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/client";
import { calculateSolution } from "@/lib/local-catalog/calculate-solution";
import { getBusinessType, getSolution } from "@/lib/local-catalog/catalog";
import {
  clearCatalogSnapshot,
  loadCatalogSnapshot,
  type CatalogSnapshot,
} from "@/lib/local-catalog/snapshot";
import {
  formatMonthlyTotal,
  formatSetupTotal,
} from "@/lib/local-catalog/pricing";
import {
  applyCatalogSnapshot,
  completeRegistration,
} from "@/lib/registration/actions";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [snapshot, setSnapshot] = useState<CatalogSnapshot | null>(null);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    setSnapshot(loadCatalogSnapshot());
    setSnapshotLoaded(true);
  }, []);

  const result = useMemo(
    () =>
      snapshot
        ? calculateSolution({
            businessType: snapshot.businessType,
            selectedGoals: snapshot.goals,
            selectedSolutions: snapshot.solutions,
            metrics: snapshot.metrics,
          })
        : null,
    [snapshot],
  );

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      business: "",
      whatsapp: "",
      email: "",
      city: "",
      password: "",
    },
  });

  function snapshotPayload() {
    if (!snapshot) {
      return null;
    }
    return {
      businessType: snapshot.businessType,
      goals: snapshot.goals,
      solutions: snapshot.solutions,
      metrics: snapshot.metrics,
      sourceCta: snapshot.sourceCta,
    };
  }

  async function finishActivation(values?: Pick<RegisterInput, "business" | "city" | "whatsapp">) {
    const payload = snapshotPayload();

    if (payload && payload.solutions.length > 0 && !values) {
      const applied = await applyCatalogSnapshot({ snapshot: payload });
      if (applied.ok) {
        clearCatalogSnapshot();
        toast.success("Tu solución quedó en tu portal.");
        router.push("/portal");
        router.refresh();
        return;
      }
      if (applied.code !== "NO_ORG") {
        setServerError(applied.error);
        return;
      }
    }

    if (!values) {
      setServerError("Completa los datos de tu negocio para continuar.");
      return;
    }

    const completion = await completeRegistration({
      business: values.business,
      city: values.city,
      whatsapp: values.whatsapp,
      snapshot: payload,
    });

    if (!completion.ok) {
      setServerError(completion.error);
      return;
    }

    clearCatalogSnapshot();
    toast.success("Tu cuenta está lista. Bienvenido a tu portal.");
    router.push("/portal");
    router.refresh();
  }

  async function onSubmit(values: RegisterInput) {
    setServerError(null);

    if (session) {
      await finishActivation(values);
      return;
    }

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (error.code === "USER_ALREADY_EXISTS") {
        const { error: signInError } = await authClient.signIn.email({
          email: values.email,
          password: values.password,
        });
        if (signInError) {
          setServerError(
            "Ya existe una cuenta con ese email. Entra con tu contraseña o inicia sesión.",
          );
          return;
        }
        await finishActivation(values);
        return;
      }

      setServerError("No pudimos crear tu cuenta. Intenta de nuevo.");
      return;
    }

    await finishActivation(values);
  }

  async function activateExistingAccount() {
    setServerError(null);
    setActivating(true);
    try {
      await finishActivation();
    } finally {
      setActivating(false);
    }
  }

  return (
    <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="rounded-2xl border border-white/8 bg-card p-6 shadow-[0_0_30px_rgba(19,200,236,0.08)]">
        <h1 className="font-heading text-xl font-black tracking-tight text-white">
          {session ? "Activa tu solución" : "Crea tu cuenta"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {session
            ? "Ya tienes cuenta. Activamos esta configuración en tu portal de cliente."
            : "Con tu cuenta activamos tu solución y te damos acceso a tu portal de cliente."}
        </p>

        {session && snapshotLoaded && snapshot && snapshot.solutions.length > 0 ? (
          <div className="mt-6 space-y-4">
            {serverError ? (
              <p className="text-sm text-destructive" role="alert">
                {serverError}
              </p>
            ) : null}
            <Button
              type="button"
              className="h-12 w-full"
              disabled={activating || sessionPending}
              onClick={activateExistingAccount}
            >
              {activating ? "Activando…" : "Activar esta solución en mi cuenta"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿No es tu cuenta?{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => authClient.signOut()}
              >
                Salir
              </button>
            </p>
          </div>
        ) : (
        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            id="reg-name"
            label="Tu nombre"
            error={form.formState.errors.name?.message}
          >
            <Input
              id="reg-name"
              autoComplete="name"
              className="h-11"
              {...form.register("name")}
            />
          </FormField>
          <FormField
            id="reg-business"
            label="Nombre del negocio"
            error={form.formState.errors.business?.message}
          >
            <Input
              id="reg-business"
              autoComplete="organization"
              className="h-11"
              {...form.register("business")}
            />
          </FormField>
          <FormField
            id="reg-whatsapp"
            label="WhatsApp"
            error={form.formState.errors.whatsapp?.message}
          >
            <Input
              id="reg-whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="h-11"
              {...form.register("whatsapp")}
            />
          </FormField>
          <FormField
            id="reg-city"
            label="Ciudad"
            error={form.formState.errors.city?.message}
          >
            <Input
              id="reg-city"
              autoComplete="address-level2"
              className="h-11"
              {...form.register("city")}
            />
          </FormField>
          <FormField
            id="reg-email"
            label="Email"
            error={form.formState.errors.email?.message}
          >
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              className="h-11"
              {...form.register("email")}
            />
          </FormField>
          <FormField
            id="reg-password"
            label="Contraseña"
            error={form.formState.errors.password?.message}
          >
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              className="h-11"
              {...form.register("password")}
            />
          </FormField>

          {serverError ? (
            <p className="text-sm text-destructive sm:col-span-2" role="alert">
              {serverError}
            </p>
          ) : null}

          <Button
            type="submit"
            className="h-12 sm:col-span-2"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creando tu cuenta…"
              : "Crear mi cuenta y activar mi solución"}
          </Button>
        </form>
        )}

        {!session ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
        ) : null}
      </div>

      <aside className="h-fit rounded-2xl border border-white/8 bg-card p-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Tu solución
        </p>
        {snapshotLoaded && snapshot && result && snapshot.solutions.length > 0 ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              {snapshot.businessType
                ? getBusinessType(snapshot.businessType).name
                : "Negocio local"}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {snapshot.solutions.map((id) => (
                <li key={id} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {getSolution(id).name}
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <dl className="space-y-2 text-sm">
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
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Al crear tu cuenta, esta configuración queda guardada y nuestro
              equipo te acompaña en la activación.
            </p>
          </>
        ) : snapshotLoaded ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Aún no has armado tu solución. Puedes crear la cuenta ahora y
              armarla después, o{" "}
              <Link href="/catalogo" className="font-medium text-primary hover:underline">
                armar tu solución primero
              </Link>
              .
            </p>
          </>
        ) : null}
      </aside>
    </div>
  );
}

function FormField({
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
