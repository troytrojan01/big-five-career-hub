import { desc, eq } from "drizzle-orm";

import { curatedJobs, type JobListing } from "@bigfive/content";
import { getDb, jobListings } from "@bigfive/db";

import { parseImportText } from "@/lib/import-jobs";

import officialCareerPageJobs from "../../../data/job-imports/2026-04-07-official-career-pages.json";

type DbJobListing = typeof jobListings.$inferSelect;
const staticOfficialJobs = parseImportText(JSON.stringify(officialCareerPageJobs), "json").jobs;

type SupabaseJobRow = {
  source_company: JobListing["sourceCompany"];
  external_job_id: string;
  slug: string;
  title: string;
  role_family: string;
  level: string;
  location: string;
  work_mode: JobListing["workMode"];
  team: string;
  short_summary: string;
  official_apply_url: string;
  posted_at: string;
  last_verified_at: string;
  status: JobListing["status"];
  is_featured: boolean | null;
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function isProductionBuild() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function arePostgresReadsDisabled() {
  return process.env.DISABLE_DATABASE_READS === "true";
}

function shouldUsePostgres() {
  return hasDatabaseUrl() && !isProductionBuild() && !arePostgresReadsDisabled();
}

function getSupabaseAdminRestConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    serviceRoleKey,
    jobsEndpoint: new URL("/rest/v1/job_listings", url),
  };
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

function fromSupabaseJobRow(row: SupabaseJobRow): JobListing {
  return {
    sourceCompany: row.source_company,
    externalJobId: row.external_job_id,
    slug: row.slug,
    title: row.title,
    roleFamily: row.role_family,
    level: row.level,
    location: row.location,
    workMode: row.work_mode,
    team: row.team,
    shortSummary: row.short_summary,
    officialApplyUrl: row.official_apply_url,
    postedAt: row.posted_at,
    lastVerifiedAt: row.last_verified_at,
    status: row.status,
    isFeatured: Boolean(row.is_featured),
  };
}

function logFallback(error: unknown) {
  console.warn("Falling back to static curated jobs.", error instanceof Error ? error.message : error);
}

function getSupabaseRestHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
}

function sortByNewestPosted(jobs: JobListing[]) {
  return [...jobs].sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

async function getJobsFromSupabaseRest() {
  const config = getSupabaseAdminRestConfig();

  if (!config) {
    return null;
  }

  const endpoint = new URL(config.jobsEndpoint);
  endpoint.searchParams.set(
    "select",
    "source_company,external_job_id,slug,title,role_family,level,location,work_mode,team,short_summary,official_apply_url,posted_at,last_verified_at,status,is_featured",
  );
  endpoint.searchParams.set("order", "posted_at.desc");

  const response = await fetch(endpoint, {
    headers: getSupabaseRestHeaders(config.serviceRoleKey),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase REST job read failed with status ${response.status}.`);
  }

  const rows = (await response.json()) as SupabaseJobRow[];
  return rows.length ? rows.map(fromSupabaseJobRow) : null;
}

async function getJobBySlugFromSupabaseRest(slug: string) {
  const config = getSupabaseAdminRestConfig();

  if (!config) {
    return null;
  }

  const endpoint = new URL(config.jobsEndpoint);
  endpoint.searchParams.set(
    "select",
    "source_company,external_job_id,slug,title,role_family,level,location,work_mode,team,short_summary,official_apply_url,posted_at,last_verified_at,status,is_featured",
  );
  endpoint.searchParams.set("slug", `eq.${slug}`);
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint, {
    headers: getSupabaseRestHeaders(config.serviceRoleKey),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase REST job read failed with status ${response.status}.`);
  }

  const rows = (await response.json()) as SupabaseJobRow[];
  return rows[0] ? fromSupabaseJobRow(rows[0]) : null;
}

async function getJobsFromPostgres() {
  try {
    const db = getDb();
    const rows = await db.select().from(jobListings).orderBy(desc(jobListings.postedAt));

    return rows.length ? rows.map(toJobListing) : null;
  } catch (error) {
    logFallback(error);
    return null;
  }
}

async function getJobBySlugFromPostgres(slug: string) {
  try {
    const db = getDb();
    const rows = await db.select().from(jobListings).where(eq(jobListings.slug, slug)).limit(1);

    if (rows[0]) {
      return toJobListing(rows[0]);
    }
  } catch (error) {
    logFallback(error);
  }

  return null;
}

export async function getJobs() {
  try {
    const supabaseJobs = await getJobsFromSupabaseRest();
    if (supabaseJobs) {
      return supabaseJobs;
    }
  } catch (error) {
    logFallback(error);
  }

  if (shouldUsePostgres()) {
    const postgresJobs = await getJobsFromPostgres();
    if (postgresJobs) {
      return postgresJobs;
    }
  }

  return staticOfficialJobs.length ? sortByNewestPosted(staticOfficialJobs) : curatedJobs;
}

export async function getJobBySlug(slug: string) {
  try {
    const supabaseJob = await getJobBySlugFromSupabaseRest(slug);
    if (supabaseJob) {
      return supabaseJob;
    }
  } catch (error) {
    logFallback(error);
  }

  if (shouldUsePostgres()) {
    const postgresJob = await getJobBySlugFromPostgres(slug);
    if (postgresJob) {
      return postgresJob;
    }
  }

  return staticOfficialJobs.find((job) => job.slug === slug) ?? curatedJobs.find((job) => job.slug === slug);
}
