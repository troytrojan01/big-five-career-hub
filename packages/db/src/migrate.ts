import path from "node:path";

import { migrate } from "drizzle-orm/postgres-js/migrator";

import { closeDb, getDb } from "./client";

async function main() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const db = getDb();

  await migrate(db, {
    migrationsFolder: path.resolve(process.cwd(), "drizzle"),
  });

  console.log("Database migrations applied.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await closeDb();
  });
