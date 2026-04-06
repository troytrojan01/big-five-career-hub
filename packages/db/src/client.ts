import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let sqlClient: postgres.Sql | null = null;

export function getDb() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!dbInstance) {
    sqlClient = postgres(url, {
      prepare: false,
      max: 1,
    });

    dbInstance = drizzle(sqlClient);
  }

  return dbInstance;
}

export async function closeDb() {
  if (sqlClient) {
    await sqlClient.end();
  }

  sqlClient = null;
  dbInstance = null;
}
