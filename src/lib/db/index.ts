import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

// For serverless/edge environments (like Vercel) and long-lived instances
const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: connectionString.includes("supabase") || connectionString.includes("sslmode=require")
    ? "require"
    : false,
});

export const db = drizzle(client, { schema });
export { schema };
