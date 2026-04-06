import { desc, eq } from "drizzle-orm";

import { curatedJobs, type JobListing } from "@bigfive/content";
import { getDb, jobListings } from "@bigfive/db";

type DbJobListing = typeof jobListings.$inferSelect;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function toJobListing(job: DbJobListing): JobListing {
  return {
    sourceCompany: job.sourceCompany,
    externalJobId: job.externalJobId,
    slug: job.slug,
    title: job.title,
    roleFamily: job.roleFamily,
    level: job.level,
    location: job.location,
    workMode: job.workMode,
    team: job.team,
    shortSummary: job.shortSummary,
    officialApplyUrl: job.officialApplyUrl,
    postedAt: job.postedAt.toISOString(),
    lastVerifiedAt: job.lastVerifiedAt.toISOString(),
    status: job.status,
    isFeatured: job.isFeatured,
  };
}

function logFallback(error: unknown) {
  console.warn("Falling back to static curated jobs.", error instanceof Error ? error.message : error);
}

export async function getJobs() {
  if (!hasDatabaseUrl()) {
    return curatedJobs;
  }

  try {
    const db = getDb();
    const rows = await db.select().from(jobListings).orderBy(desc(jobListings.isFeatured), desc(jobListings.lastVerifiedAt));

    return rows.length ? rows.map(toJobListing) : curatedJobs;
  } catch (error) {
    logFallback(error);
    return curatedJobs;
  }
}

export async function getJobBySlug(slug: string) {
  if (hasDatabaseUrl()) {
    try {
      const db = getDb();
      const rows = await db.select().from(jobListings).where(eq(jobListings.slug, slug)).limit(1);

      if (rows[0]) {
        return toJobListing(rows[0]);
      }
    } catch (error) {
      logFallback(error);
    }
  }

  return curatedJobs.find((job) => job.slug === slug);
}
