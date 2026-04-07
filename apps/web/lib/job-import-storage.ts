import { sql } from "drizzle-orm";

import type { JobListing } from "@bigfive/content";
import { getDb, jobListings } from "@bigfive/db";

type JobImportStorage = "PostgreSQL" | "Supabase REST";

function getSupabaseAdminRestConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  const endpoint = new URL("/rest/v1/job_listings", url);
  endpoint.searchParams.set("on_conflict", "source_company,external_job_id");

  return {
    endpoint: endpoint.toString(),
    serviceRoleKey,
  };
}

function toSupabaseJobRow(job: JobListing) {
  return {
    source_company: job.sourceCompany,
    external_job_id: job.externalJobId,
    slug: job.slug,
    title: job.title,
    role_family: job.roleFamily,
    level: job.level,
    location: job.location,
    work_mode: job.workMode,
    team: job.team,
    short_summary: job.shortSummary,
    official_apply_url: job.officialApplyUrl,
    posted_at: job.postedAt,
    last_verified_at: job.lastVerifiedAt,
    status: job.status,
    is_featured: job.isFeatured,
    updated_at: new Date().toISOString(),
  };
}

async function saveImportedJobsWithSupabaseRest(jobs: JobListing[]): Promise<JobImportStorage> {
  const config = getSupabaseAdminRestConfig();

  if (!config) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured.");
  }

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(jobs.map(toSupabaseJobRow)),
  });

  if (!response.ok) {
    throw new Error(`Supabase REST job import failed with status ${response.status}.`);
  }

  return "Supabase REST";
}

async function saveImportedJobsWithPostgres(jobs: JobListing[]): Promise<JobImportStorage> {
  const db = getDb();
  await db
    .insert(jobListings)
    .values(
      jobs.map((job) => ({
        ...job,
        postedAt: new Date(job.postedAt),
        lastVerifiedAt: new Date(job.lastVerifiedAt),
      })),
    )
    .onConflictDoUpdate({
      target: [jobListings.sourceCompany, jobListings.externalJobId],
      set: {
        slug: sql`excluded.slug`,
        title: sql`excluded.title`,
        roleFamily: sql`excluded.role_family`,
        level: sql`excluded.level`,
        location: sql`excluded.location`,
        workMode: sql`excluded.work_mode`,
        team: sql`excluded.team`,
        shortSummary: sql`excluded.short_summary`,
        officialApplyUrl: sql`excluded.official_apply_url`,
        postedAt: sql`excluded.posted_at`,
        lastVerifiedAt: sql`excluded.last_verified_at`,
        status: sql`excluded.status`,
        isFeatured: sql`excluded.is_featured`,
        updatedAt: new Date(),
      },
    });

  return "PostgreSQL";
}

export async function saveImportedJobs(jobs: JobListing[]): Promise<JobImportStorage> {
  if (getSupabaseAdminRestConfig()) {
    return saveImportedJobsWithSupabaseRest(jobs);
  }

  return saveImportedJobsWithPostgres(jobs);
}
