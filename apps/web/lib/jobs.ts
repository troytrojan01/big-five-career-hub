import type { JobListing } from "@bigfive/content";

export interface JobFilters {
  company?: string;
  roleFamily?: string;
  level?: string;
  location?: string;
  workMode?: string;
  search?: string;
}

const FRESHNESS_WINDOW_MS = 1000 * 60 * 60 * 48;

export function isJobFresh(lastVerifiedAt: string, now = new Date()) {
  return now.getTime() - new Date(lastVerifiedAt).getTime() <= FRESHNESS_WINDOW_MS;
}

export function getJobStatus(job: JobListing, now = new Date()) {
  if (job.status !== "active") {
    return "inactive";
  }

  return isJobFresh(job.lastVerifiedAt, now) ? "active" : "inactive";
}

export function filterJobs(jobs: JobListing[], filters: JobFilters, now = new Date()) {
  const normalizedSearch = filters.search?.trim().toLowerCase();

  return jobs.filter((job) => {
    if (getJobStatus(job, now) !== "active") {
      return false;
    }

    if (filters.company && job.sourceCompany !== filters.company) {
      return false;
    }

    if (filters.roleFamily && job.roleFamily !== filters.roleFamily) {
      return false;
    }

    if (filters.level && job.level !== filters.level) {
      return false;
    }

    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    if (filters.workMode && job.workMode !== filters.workMode) {
      return false;
    }

    if (normalizedSearch) {
      const haystack = [
        job.title,
        job.team,
        job.roleFamily,
        job.location,
        job.sourceCompany,
        job.shortSummary,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    }

    return true;
  });
}

export function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
