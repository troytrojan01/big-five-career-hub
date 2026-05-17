import { eq, sql } from "drizzle-orm";

import type { CompanySlug, JobListing } from "@bigfive/content";
import { getDb, jobListings, jobSyncRuns } from "@bigfive/db";

type JobImportStorage = "PostgreSQL" | "Supabase REST";

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
  updated_at?: string;
};

export interface JobSyncRunRecord {
  sourceCompany: CompanySlug;
  status: string;
  fetchedCount: number;
  insertedCount: number;
  updatedCount: number;
  inactivatedCount: number;
  errorMessage?: string | null;
  startedAt: string;
  finishedAt?: string | null;
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
    syncRunsEndpoint: new URL("/rest/v1/job_sync_runs", url),
  };
}

function getSupabaseRestHeaders(serviceRoleKey: string, prefer = "resolution=merge-duplicates,return=minimal") {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

function toSupabaseJobRow(job: JobListing): SupabaseJobRow {
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
    is_featured: job.isFeatured ?? false,
    updated_at: new Date().toISOString(),
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

async function upsertJobsWithSupabaseRest(jobs: JobListing[]): Promise<JobImportStorage> {
  const config = getSupabaseAdminRestConfig();

  if (!config) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured.");
  }

  const endpoint = new URL(config.jobsEndpoint);
  endpoint.searchParams.set("on_conflict", "source_company,external_job_id");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: getSupabaseRestHeaders(config.serviceRoleKey),
    body: JSON.stringify(jobs.map(toSupabaseJobRow)),
  });

  if (!response.ok) {
    throw new Error(`Supabase REST job import failed with status ${response.status}: ${await response.text()}`);
  }

  return "Supabase REST";
}

async function upsertJobsWithPostgres(jobs: JobListing[]): Promise<JobImportStorage> {
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

async function listCompanyJobsWithSupabaseRest(company: CompanySlug) {
  const config = getSupabaseAdminRestConfig();

  if (!config) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured.");
  }

  const endpoint = new URL(config.jobsEndpoint);
  endpoint.searchParams.set(
    "select",
    "source_company,external_job_id,slug,title,role_family,level,location,work_mode,team,short_summary,official_apply_url,posted_at,last_verified_at,status,is_featured",
  );
  endpoint.searchParams.set("source_company", `eq.${company}`);
  endpoint.searchParams.set("limit", "500");

  const response = await fetch(endpoint, {
    headers: getSupabaseRestHeaders(config.serviceRoleKey, "return=representation"),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase REST company snapshot failed with status ${response.status}: ${await response.text()}`);
  }

  return ((await response.json()) as SupabaseJobRow[]).map(fromSupabaseJobRow);
}

async function listCompanyJobsWithPostgres(company: CompanySlug) {
  const db = getDb();
  const rows = await db.select().from(jobListings).where(eq(jobListings.sourceCompany, company));

  return rows.map((row) => ({
    sourceCompany: row.sourceCompany,
    externalJobId: row.externalJobId,
    slug: row.slug,
    title: row.title,
    roleFamily: row.roleFamily,
    level: row.level,
    location: row.location,
    workMode: row.workMode,
    team: row.team,
    shortSummary: row.shortSummary,
    officialApplyUrl: row.officialApplyUrl,
    postedAt: row.postedAt.toISOString(),
    lastVerifiedAt: row.lastVerifiedAt.toISOString(),
    status: row.status,
    isFeatured: row.isFeatured,
  }));
}

async function saveJobSyncRunWithSupabaseRest(payload: JobSyncRunRecord) {
  const config = getSupabaseAdminRestConfig();

  if (!config) {
    return;
  }

  const response = await fetch(config.syncRunsEndpoint, {
    method: "POST",
    headers: getSupabaseRestHeaders(config.serviceRoleKey),
    body: JSON.stringify([
      {
        source_company: payload.sourceCompany,
        status: payload.status,
        fetched_count: payload.fetchedCount,
        inserted_count: payload.insertedCount,
        updated_count: payload.updatedCount,
        inactivated_count: payload.inactivatedCount,
        error_message: payload.errorMessage ?? null,
        started_at: payload.startedAt,
        finished_at: payload.finishedAt ?? null,
      },
    ]),
  });

  if (!response.ok) {
    throw new Error(`Supabase REST sync run logging failed with status ${response.status}: ${await response.text()}`);
  }
}

async function saveJobSyncRunWithPostgres(payload: JobSyncRunRecord) {
  const db = getDb();

  await db.insert(jobSyncRuns).values({
    sourceCompany: payload.sourceCompany,
    status: payload.status,
    fetchedCount: payload.fetchedCount,
    insertedCount: payload.insertedCount,
    updatedCount: payload.updatedCount,
    inactivatedCount: payload.inactivatedCount,
    errorMessage: payload.errorMessage ?? null,
    startedAt: new Date(payload.startedAt),
    finishedAt: payload.finishedAt ? new Date(payload.finishedAt) : null,
  });
}

export async function saveImportedJobs(jobs: JobListing[]): Promise<JobImportStorage> {
  if (getSupabaseAdminRestConfig()) {
    return upsertJobsWithSupabaseRest(jobs);
  }

  return upsertJobsWithPostgres(jobs);
}

export async function listCompanyJobs(company: CompanySlug) {
  if (getSupabaseAdminRestConfig()) {
    return listCompanyJobsWithSupabaseRest(company);
  }

  return listCompanyJobsWithPostgres(company);
}

export async function markJobsInactive(company: CompanySlug, externalJobIds: string[], verifiedAt: string) {
  if (!externalJobIds.length) {
    return 0;
  }

  const existingJobs = await listCompanyJobs(company);
  const jobsToInactivate = existingJobs
    .filter((job) => externalJobIds.includes(job.externalJobId) && job.status !== "inactive")
    .map((job) => ({
      ...job,
      lastVerifiedAt: verifiedAt,
      status: "inactive" as const,
    }));

  if (!jobsToInactivate.length) {
    return 0;
  }

  await saveImportedJobs(jobsToInactivate);
  return jobsToInactivate.length;
}

export async function deleteJobsForCompany(company: CompanySlug) {
  if (getSupabaseAdminRestConfig()) {
    throw new Error("Company deletion is intentionally unsupported for Supabase REST storage.");
  }

  const db = getDb();
  await db.delete(jobListings).where(eq(jobListings.sourceCompany, company));
}

export async function saveJobSyncRun(payload: JobSyncRunRecord) {
  try {
    if (getSupabaseAdminRestConfig()) {
      await saveJobSyncRunWithSupabaseRest(payload);
      return;
    }

    await saveJobSyncRunWithPostgres(payload);
  } catch (error) {
    console.warn(
      "Job sync run logging failed.",
      error instanceof Error ? error.message : String(error),
    );
  }
}

export async function listActiveExternalJobIds(company: CompanySlug) {
  const jobs = await listCompanyJobs(company);
  return jobs.filter((job) => job.status === "active").map((job) => job.externalJobId);
}

export async function setJobsInactiveExcept(company: CompanySlug, activeExternalJobIds: string[], verifiedAt: string) {
  const existingJobs = await listCompanyJobs(company);
  const activeSet = new Set(activeExternalJobIds);
  const jobsToInactivate = existingJobs.filter(
    (job) => job.status === "active" && !activeSet.has(job.externalJobId),
  );

  if (!jobsToInactivate.length) {
    return 0;
  }

  await saveImportedJobs(
    jobsToInactivate.map((job) => ({
      ...job,
      status: "inactive",
      lastVerifiedAt: verifiedAt,
    })),
  );

  return jobsToInactivate.length;
}

export async function replaceCompanyJobs(
  company: CompanySlug,
  jobs: JobListing[],
  verifiedAt: string,
  options: { deactivateMissing?: boolean } = {},
) {
  const existingJobs = await listCompanyJobs(company);
  const existingIds = new Set(existingJobs.map((job) => job.externalJobId));
  const incomingIds = new Set(jobs.map((job) => job.externalJobId));

  await saveImportedJobs(jobs);

  const inactivatedCount = options.deactivateMissing
    ? await setJobsInactiveExcept(company, [...incomingIds], verifiedAt)
    : 0;

  let insertedCount = 0;
  let updatedCount = 0;

  jobs.forEach((job) => {
    if (existingIds.has(job.externalJobId)) {
      updatedCount += 1;
    } else {
      insertedCount += 1;
    }
  });

  return {
    insertedCount,
    updatedCount,
    inactivatedCount,
    existingCount: existingJobs.length,
  };
}
