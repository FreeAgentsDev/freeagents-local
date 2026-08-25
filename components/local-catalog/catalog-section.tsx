import { cn } from "@/lib/utils";

type CatalogSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function CatalogSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: CatalogSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-6", className)}>
      <div className="max-w-2xl space-y-2">
        {eyebrow ? (
          <p className="text-xs font-bold tracking-widest text-primary uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-heading text-2xl font-black tracking-tight text-white">
          {title}
        </h2>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
