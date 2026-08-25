import { CatalogProvider } from "@/components/local-catalog/catalog-provider";
import { PublicFooter } from "@/components/local-catalog/public-footer";
import { PublicHeader } from "@/components/local-catalog/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CatalogProvider>
      <div className="flex min-h-svh flex-col overflow-x-hidden">
        <PublicHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <PublicFooter />
      </div>
    </CatalogProvider>
  );
}
