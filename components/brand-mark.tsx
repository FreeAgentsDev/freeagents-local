import Image from "next/image";
import Link from "next/link";

import faLogo from "@/assets/brand/fa-logo.png";
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
      className={cn("group flex items-center gap-2.5", className)}
      aria-label={label}
    >
      <Image
        src={faLogo}
        alt="FreeAgents"
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-full object-cover ring-2 ring-primary/20 transition-all group-hover:ring-primary/50"
        priority
      />
      <span className="text-sm font-black tracking-tight text-white">
        Free<span className="text-primary">Agents</span>
      </span>
    </Link>
  );
}
