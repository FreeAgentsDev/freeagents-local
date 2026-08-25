import { BrandMark } from "@/components/brand-mark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4">
          <BrandMark />
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
