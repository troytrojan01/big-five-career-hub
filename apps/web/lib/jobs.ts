import type { JobListing } from "@bigfive/content";

export interface JobFilters {
  company?: string;
  roleFamily?: string;
  level?: string;
  location?: string;
  workMode?: string;
  team?: string;
  search?: string;
  sort?: string;
}

const FRESHNESS_WINDOW_MS = 1000 * 60 * 60 * 48;
const HOUR_MS = 1000 * 60 * 60;

export function isJobFresh(lastVerifiedAt: string, now = new Date()) {
  return now.getTime() - new Date(lastVerifiedAt).getTime() <= FRESHNESS_WINDOW_MS;
}

export function getJobStatus(job: JobListing, now = new Date()) {
  if (job.status !== "active") {
    return "inactive";
  }

  return isJobFresh(job.lastVerifiedAt, now) ? "active" : "inactive";
}

export function getHoursSinceVerification(lastVerifiedAt: string, now = new Date()) {
  return Math.max(0, Math.floor((now.getTime() - new Date(lastVerifiedAt).getTime()) / HOUR_MS));
}

export function getJobFreshnessLabel(job: JobListing, now = new Date()) {
  const hours = getHoursSinceVerification(job.lastVerifiedAt, now);

  if (getJobStatus(job, now) === "inactive") {
    return `Needs recheck (${hours}h old)`;
  }

  if (hours >= 36) {
    return `Recheck soon (${hours}h old)`;
  }

  return `Fresh (${hours}h old)`;
}

export function getApplyLinkQuality(job: JobListing) {
  const url = new URL(job.officialApplyUrl);
  const path = url.pathname.replace(/\/$/, "");
  const externalId = job.externalJobId.toLowerCase();
  const normalizedUrl = job.officialApplyUrl.toLowerCase();
  const genericPaths = new Set([
    "",
    "/",
    "/jobs",
    "/en-us/search",
    "/v2/global/en/search-results",
    "/about/careers/applications/jobs/results",
  ]);

  if (normalizedUrl.includes(externalId)) {
    return {
      kind: "exact" as const,
      label: "Exact official job link",
      description: "This CTA appears to point directly to the employer's role page.",
    };
  }

  if (genericPaths.has(path)) {
    return {
      kind: "search" as const,
      label: "Official careers search",
      description: "This CTA goes to an official company search page, so candidates may need to search the title or team.",
    };
  }

  return {
    kind: "review" as const,
    label: "Official link to review",
    description: "This CTA points to an official employer page, but it should be checked before publishing as an exact role link.",
  };
}

export function getJobDataQualityWarnings(job: JobListing, now = new Date()) {
  const warnings: string[] = [];
  const freshnessStatus = getJobStatus(job, now);
  const applyLinkQuality = getApplyLinkQuality(job);

  if (freshnessStatus === "inactive") {
    warnings.push("This role is outside the 48-hour verification window.");
  }

  if (applyLinkQuality.kind !== "exact") {
    warnings.push(applyLinkQuality.description);
  }

  return warnings;
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

    if (filters.team && job.team !== filters.team) {
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
  }).sort((a, b) => {
    if (filters.sort === "posted") {
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }

    if (filters.sort === "verified") {
      return new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime();
    }

    return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
  });
}

export function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
