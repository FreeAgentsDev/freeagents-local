import { cn } from "@/lib/utils";

type SelectableCardProps = {
  selected: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  accessory?: React.ReactNode;
  onSelect: () => void;
  className?: string;
};

export function SelectableCard({
  selected,
  title,
  description,
  icon,
  badge,
  accessory,
  onSelect,
  className,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group flex h-full w-full flex-col items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-sm transition-all duration-200",
        "hover:border-primary/40 hover:shadow-md",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected
          ? "border-primary bg-accent/70 ring-2 ring-primary/20"
          : "border-border",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-lg transition-colors",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
          )}
        >
          {icon}
        </span>
        {accessory ?? (
          <span
            aria-hidden="true"
            className={cn(
              "mt-1 flex size-5 items-center justify-center rounded-full border transition-all",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background",
            )}
          >
            {selected ? (
              <svg viewBox="0 0 16 16" className="size-3" fill="none">
                <path
                  d="M3.5 8.5 6.5 11.5 12.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="font-medium tracking-tight text-foreground">{title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {badge}
    </button>
  );
}
