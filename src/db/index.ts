import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as {
  queryClient: ReturnType<typeof postgres> | undefined;
};

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForDb.queryClient) {
    globalForDb.queryClient = postgres(url, { max: 10 });
  }
  return globalForDb.queryClient;
}

export const db = drizzle(getClient(), { schema });

export type Db = typeof db;
