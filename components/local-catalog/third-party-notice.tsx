import { THIRD_PARTY_COST_ITEMS } from "@/lib/local-catalog/catalog";

export function ThirdPartyNotice({ notes }: { notes: string[] }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4">
      <p className="text-sm font-medium">Servicios de terceros</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Puede haber costos adicionales por herramientas que no opera
        FreeAgents. No están escondidos en la mensualidad.
      </p>
      <ul className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
        {THIRD_PARTY_COST_ITEMS.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
      {notes.length > 0 ? (
        <div className="mt-3 space-y-1">
          {notes.map((note) => (
            <p key={note} className="text-sm text-muted-foreground">
              {note}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
