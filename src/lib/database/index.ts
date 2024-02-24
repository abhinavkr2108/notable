import { Pool, neon, neonConfig } from "@neondatabase/serverless";
import { NeonClient, drizzle } from "drizzle-orm/neon-serverless";

neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool);
