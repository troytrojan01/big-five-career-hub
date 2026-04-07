import type { JobListing } from "@bigfive/content";

export interface JobFilters {
  company?: string;
  roleFamily?: string;
  level?: string;
  location?: string;
  workMode?: string;
  team?: string;
  search?: string;
  postedWithin?: string;
  sort?: string;
}

const HOUR_MS = 1000 * 60 * 60;
const DAY_MS = HOUR_MS * 24;
const POSTED_WITHIN_DAYS = new Set(["1", "3", "7", "14", "30"]);

export function isJobPostedWithin(postedAt: string, days: string | undefined, now = new Date()) {
  if (!days || !POSTED_WITHIN_DAYS.has(days)) {
    return true;
  }

  const ageMs = now.getTime() - new Date(postedAt).getTime();
  return ageMs <= Number(days) * DAY_MS;
}

export function getJobStatus(job: JobListing) {
  return job.status;
}

export function getHoursSinceVerification(lastVerifiedAt: string, now = new Date()) {
  return Math.max(0, Math.floor((now.getTime() - new Date(lastVerifiedAt).getTime()) / HOUR_MS));
}

export function getJobFreshnessLabel(job: JobListing, now = new Date()) {
  const hours = getHoursSinceVerification(job.lastVerifiedAt, now);

  return `Verified ${hours}h ago`;
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

export function getJobDataQualityWarnings(job: JobListing) {
  const warnings: string[] = [];
  const applyLinkQuality = getApplyLinkQuality(job);

  if (getJobStatus(job) === "inactive") {
    warnings.push("This role is currently marked inactive.");
  }

  if (applyLinkQuality.kind !== "exact") {
    warnings.push(applyLinkQuality.description);
  }

  return warnings;
}

export function filterJobs(jobs: JobListing[], filters: JobFilters, now = new Date()) {
  const normalizedSearch = filters.search?.trim().toLowerCase();

  return jobs.filter((job) => {
    if (getJobStatus(job) !== "active") {
      return false;
    }

    if (!isJobPostedWithin(job.postedAt, filters.postedWithin, now)) {
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
    if (filters.sort === "verified") {
      return new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime();
    }

    if (filters.sort === "featured") {
      return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
    }

    return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
  });
}

export function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
