import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/lib/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.VERCEL ? 1 : 10,
  ssl: process.env.VERCEL ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });

export type Db = typeof db;
