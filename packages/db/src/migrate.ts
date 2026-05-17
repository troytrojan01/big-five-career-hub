import path from "node:path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main() {
  const url = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL;

  if (!url) {
    throw new Error("MIGRATION_DATABASE_URL or DATABASE_URL is not configured.");
  }

  const sqlClient = postgres(url, {
    prepare: false,
    max: 1,
    connect_timeout: 8,
    idle_timeout: 20,
  });
  const db = drizzle(sqlClient);

  try {
    await migrate(db, {
      migrationsFolder: path.resolve(process.cwd(), "drizzle"),
    });

    console.log("Database migrations applied.");
  } finally {
    await sqlClient.end();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
