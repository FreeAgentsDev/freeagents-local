import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker / VPS image. Vercel uses its own output and breaks with standalone.
  ...(!process.env.VERCEL ? { output: "standalone" as const } : {}),
};

export default nextConfig;
