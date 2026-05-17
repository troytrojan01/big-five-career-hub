import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const companySlugEnum = pgEnum("company_slug", [
  "amazon",
  "apple",
  "google",
  "meta",
  "microsoft",
]);

export const workModeEnum = pgEnum("work_mode", ["remote", "hybrid", "onsite"]);
export const jobStatusEnum = pgEnum("job_status", ["active", "inactive"]);

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: companySlugEnum("slug").notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  careersUrl: text("careers_url").notNull(),
  principlesSummary: text("principles_summary").notNull(),
  hiringProcessSummary: text("hiring_process_summary").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const jobListings = pgTable(
  "job_listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceCompany: companySlugEnum("source_company").notNull(),
    externalJobId: varchar("external_job_id", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    roleFamily: varchar("role_family", { length: 120 }).notNull(),
    level: varchar("level", { length: 50 }).notNull(),
    location: varchar("location", { length: 120 }).notNull(),
    workMode: workModeEnum("work_mode").notNull(),
    team: varchar("team", { length: 120 }).notNull(),
    shortSummary: text("short_summary").notNull(),
    officialApplyUrl: text("official_apply_url").notNull(),
    postedAt: timestamp("posted_at", { withTimezone: true }).notNull(),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }).notNull(),
    status: jobStatusEnum("status").default("active").notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    companyJobIdIdx: uniqueIndex("job_listings_company_external_idx").on(
      table.sourceCompany,
      table.externalJobId,
    ),
    slugIdx: uniqueIndex("job_listings_slug_idx").on(table.slug),
    statusIdx: index("job_listings_status_idx").on(table.status),
  }),
);

export const waitlistSignups = pgTable(
  "waitlist_signups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    source: varchar("source", { length: 80 }).default("website").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("waitlist_signups_email_idx").on(table.email),
  }),
);

export const jobSyncRuns = pgTable(
  "job_sync_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceCompany: companySlugEnum("source_company").notNull(),
    status: varchar("status", { length: 20 }).notNull(),
    fetchedCount: integer("fetched_count").notNull().default(0),
    insertedCount: integer("inserted_count").notNull().default(0),
    updatedCount: integer("updated_count").notNull().default(0),
    inactivatedCount: integer("inactivated_count").notNull().default(0),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sourceCompanyIdx: index("job_sync_runs_source_company_idx").on(table.sourceCompany),
    startedAtIdx: index("job_sync_runs_started_at_idx").on(table.startedAt),
  }),
);
