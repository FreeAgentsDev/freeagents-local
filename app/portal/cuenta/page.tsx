import { getUserOrganization, requireUser } from "@/lib/auth/session";
import { getOrganizationMembers } from "@/lib/portal/queries";

export const metadata = {
  title: "Cuenta",
};

const ROLE_LABELS: Record<string, string> = {
  owner: "Propietario",
  staff: "Equipo",
};

export default async function PortalAccountPage() {
  const user = await requireUser();
  const membership = (await getUserOrganization(user.id))!;
  const organization = membership.organization;
  const members = await getOrganizationMembers(organization.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cuenta</h1>
        <p className="mt-1 text-muted-foreground">
          Datos de tu negocio y de las personas con acceso al portal.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <h2 className="font-semibold tracking-tight">Negocio</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Nombre</dt>
            <dd className="font-medium">{organization.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Ciudad</dt>
            <dd className="font-medium">{organization.city ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">WhatsApp</dt>
            <dd className="font-medium">{organization.whatsapp ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Cliente desde</dt>
            <dd className="font-medium">
              {organization.createdAt.toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <h2 className="font-semibold tracking-tight">Personas con acceso</h2>
        <ul className="mt-4 divide-y divide-border">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {ROLE_LABELS[member.role] ?? member.role}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
