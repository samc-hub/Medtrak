import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Schema is created via Drizzle migrations (npx drizzle-kit migrate), so
// ensureSchema is now a no-op kept for compatibility with existing imports.
export async function ensureSchema(): Promise<void> {}