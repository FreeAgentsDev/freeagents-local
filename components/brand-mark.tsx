import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string;
  label?: string;
  className?: string;
};

export function BrandMark({
  href = "/catalogo",
  label = "FreeAgents Local",
  className,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5", className)}
      aria-label={label}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-black tracking-tight text-primary ring-2 ring-primary/25">
        FA
      </span>
      <span className="text-sm font-black tracking-tight text-white">
        Free<span className="text-primary">Agents</span>
      </span>
    </Link>
  );
}
