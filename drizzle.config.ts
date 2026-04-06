import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./packages/db/src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
