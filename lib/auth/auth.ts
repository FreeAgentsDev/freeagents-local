import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";
import { account, session, user, verification } from "@/lib/db/schema";

export const auth = betterAuth({
  baseURL: process.env.APP_URL ?? "http://localhost:3000",
  secret: process.env.AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    // Onboarding is assisted by the FreeAgents team; no email infra in V1.
    requireEmailVerification: false,
  },
  // Must stay last so server actions can set session cookies.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
