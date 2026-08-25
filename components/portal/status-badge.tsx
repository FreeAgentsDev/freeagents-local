import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_COPY: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Por activar",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  provisioning: {
    label: "En activación",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  active: {
    label: "Activo",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  paused: {
    label: "Pausado",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const copy = STATUS_COPY[status] ?? STATUS_COPY.pending;
  return (
    <Badge variant="outline" className={cn("font-medium", copy.className)}>
      {copy.label}
    </Badge>
  );
}
