import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_COPY: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Por activar",
    className: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  },
  provisioning: {
    label: "En activación",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  active: {
    label: "Activo",
    className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  },
  paused: {
    label: "Pausado",
    className: "border-white/10 bg-white/5 text-slate-400",
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
