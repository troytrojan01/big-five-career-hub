import type { CompanySlug } from "@bigfive/content";

import { listCompanyJobs, replaceCompanyJobs, saveJobSyncRun } from "@/lib/job-import-storage";

import { jobSyncAdapters } from "./adapters";
import type { CompanySyncResult } from "./types";

export interface CompanySyncError {
  company: CompanySlug;
  message: string;
}

function getAdapter(company: CompanySlug) {
  const adapter = jobSyncAdapters.find((entry) => entry.company === company);

  if (!adapter) {
    throw new Error(`No sync adapter is registered for ${company}.`);
  }

  return adapter;
}

export async function syncCompanyJobs(company: CompanySlug): Promise<CompanySyncResult> {
  const startedAt = new Date().toISOString();

  try {
    const adapter = getAdapter(company);
    const jobs = await adapter.fetchJobs();

    if (!jobs.length) {
      throw new Error(`Fetched 0 jobs for ${company}; refusing to inactivate current listings.`);
    }

    const replacement = await replaceCompanyJobs(company, jobs, new Date().toISOString(), {
      deactivateMissing: adapter.deactivateMissing ?? false,
    });

    const result: CompanySyncResult = {
      company,
      fetchedCount: jobs.length,
      importedCount: jobs.length,
      insertedCount: replacement.insertedCount,
      updatedCount: replacement.updatedCount,
      inactivatedCount: replacement.inactivatedCount,
    };

    await saveJobSyncRun({
      sourceCompany: company,
      status: "success",
      fetchedCount: result.fetchedCount,
      insertedCount: result.insertedCount,
      updatedCount: result.updatedCount,
      inactivatedCount: result.inactivatedCount,
      startedAt,
      finishedAt: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    await saveJobSyncRun({
      sourceCompany: company,
      status: "failed",
      fetchedCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      inactivatedCount: 0,
      errorMessage: error instanceof Error ? error.message : String(error),
      startedAt,
      finishedAt: new Date().toISOString(),
    });

    throw error;
  }
}

export async function syncJobs(companies?: CompanySlug[]) {
  const targets = companies?.length ? companies : jobSyncAdapters.map((adapter) => adapter.company);
  const results: CompanySyncResult[] = [];
  const errors: CompanySyncError[] = [];

  for (const company of targets) {
    try {
      results.push(await syncCompanyJobs(company));
    } catch (error) {
      errors.push({
        company,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (!results.length && errors.length) {
    throw new Error(errors.map((error) => `${error.company}: ${error.message}`).join("; "));
  }

  return {
    errors,
    results,
  };
}

export async function getSyncHealthSnapshot(companies?: CompanySlug[]) {
  const targets = companies?.length ? companies : jobSyncAdapters.map((adapter) => adapter.company);

  const snapshots = await Promise.all(
    targets.map(async (company) => ({
      company,
      jobs: await listCompanyJobs(company),
    })),
  );

  return snapshots.map((snapshot) => ({
    company: snapshot.company,
    activeCount: snapshot.jobs.filter((job) => job.status === "active").length,
    inactiveCount: snapshot.jobs.filter((job) => job.status === "inactive").length,
    latestPostedAt: snapshot.jobs
      .map((job) => job.postedAt)
      .sort((left, right) => (left < right ? 1 : -1))[0] ?? null,
  }));
}
