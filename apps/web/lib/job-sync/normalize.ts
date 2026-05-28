import slugify from "slugify";

import type { JobListing, WorkMode } from "@bigfive/content";

import type { RawSyncJob, TargetRoleFamily } from "./types";

const TARGET_FAMILIES: TargetRoleFamily[] = [
  "Software Engineering",
  "Product Management",
  "Data / ML",
  "Design / UX",
  "TPM / Program Management",
  "Solutions & Security",
];
const SLUG_MAX_LENGTH = 180;

function collapseWhitespace(value: unknown) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripHtml(value: string) {
  return collapseWhitespace(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/li>/gi, ". ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'"),
  );
}

export function truncate(value: string, maxLength = 220) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function buildStableJobSlug(raw: RawSyncJob) {
  const suffix = slugify(raw.externalJobId, {
    lower: true,
    strict: true,
    trim: true,
  }).slice(-48);
  const prefix = slugify(`${raw.sourceCompany}-${raw.title}-${raw.team}`, {
    lower: true,
    strict: true,
    trim: true,
  });
  const prefixMaxLength = Math.max(1, SLUG_MAX_LENGTH - suffix.length - 1);

  return `${prefix.slice(0, prefixMaxLength).replace(/-+$/g, "")}-${suffix}`;
}

export function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function parseDateToIso(value: string | number | Date) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "number") {
    return new Date(value).toISOString();
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Unable to parse job date "${value}".`);
  }

  return parsed.toISOString();
}

export function normalizeLocation(value: string) {
  return collapseWhitespace(
    value
      .replace(/^United States,\s*/i, "")
      .replace(/^US,\s*/i, "")
      .replace(/\s*;\s*/g, "; ")
      .replace(/^;+\s*/, "")
      .replace(/\s+,/g, ","),
  );
}

export function normalizeWorkMode(value?: string | null): WorkMode {
  const normalized = value?.toLowerCase() ?? "";

  if (
    normalized.includes("remote") ||
    normalized.includes("virtual") ||
    normalized.includes("work from home")
  ) {
    return "remote";
  }

  if (normalized.includes("hybrid") || normalized.includes("flex")) {
    return "hybrid";
  }

  return "onsite";
}

export function deriveLevel(title: string, hint?: string | null) {
  const value = `${title} ${hint ?? ""}`.toLowerCase();

  if (value.includes("intern") || value.includes("new grad") || value.includes("university")) {
    return "Intern";
  }

  if (
    value.includes("junior") ||
    value.includes("associate") ||
    value.includes("entry") ||
    /\bi\b/.test(value)
  ) {
    return "Entry";
  }

  if (
    value.includes("principal") ||
    value.includes("staff") ||
    value.includes("lead ") ||
    value.includes("manager") ||
    value.includes("director")
  ) {
    return "Lead";
  }

  if (
    value.includes("senior") ||
    value.includes("sr.") ||
    value.includes(" sr ") ||
    /\biii\b/.test(value) ||
    /\biv\b/.test(value)
  ) {
    return "Senior";
  }

  return "Mid";
}

export function deriveRoleFamily(title: string, hint?: string | null): TargetRoleFamily | null {
  const value = `${title} ${hint ?? ""}`.toLowerCase();

  if (
    value.includes("cloud solution architect") ||
    value.includes("cloud solutions architect") ||
    value.includes("solution architect") ||
    value.includes("solutions architect") ||
    value.includes("solution consultant") ||
    value.includes("solutions consultant") ||
    value.includes("security consultant") ||
    value.includes("cybersecurity consultant") ||
    value.includes("cloud consultant") ||
    value.includes("solutions engineer") ||
    value.includes("solution engineer") ||
    value.includes("sales engineer") ||
    value.includes("customer engineer") ||
    value.includes("partner engineer") ||
    value.includes("security engineer") ||
    value.includes("cybersecurity engineer") ||
    value.includes("security architect") ||
    value.includes("cloud architect") ||
    /\bcsa\b/.test(value)
  ) {
    return "Solutions & Security";
  }

  if (
    value.includes("technical program manager") ||
    value.includes("program manager") ||
    value.includes("program management") ||
    value.includes("scrum master")
  ) {
    return "TPM / Program Management";
  }

  if (value.includes("product manager") || value.includes("product management")) {
    return "Product Management";
  }

  if (
    value.includes("data scientist") ||
    value.includes("data engineer") ||
    value.includes("machine learning") ||
    value.includes("applied scientist") ||
    value.includes("research scientist") ||
    value.includes("ai ") ||
    value.includes(" ml") ||
    value.includes("analytics engineer")
  ) {
    return "Data / ML";
  }

  if (
    value.includes("designer") ||
    value.includes("ux ") ||
    value.includes("ui ") ||
    value.includes("product design") ||
    value.includes("user experience") ||
    value.includes("content design")
  ) {
    return "Design / UX";
  }

  if (
    value.includes("software engineer") ||
    value.includes("software development engineer") ||
    value.includes("sde ") ||
    value.includes("frontend engineer") ||
    value.includes("front-end engineer") ||
    value.includes("backend engineer") ||
    value.includes("back-end engineer") ||
    value.includes("full stack") ||
    value.includes("full-stack") ||
    value.includes("site reliability") ||
    value.includes("security engineer") ||
    value.includes("systems engineer") ||
    value.includes("infrastructure engineer")
  ) {
    return "Software Engineering";
  }

  return null;
}

export function buildJobListing(raw: RawSyncJob): JobListing | null {
  const roleFamily = deriveRoleFamily(raw.title, raw.roleFamilyHint ?? raw.team);

  if (!roleFamily || !TARGET_FAMILIES.includes(roleFamily)) {
    return null;
  }

  const shortSummary = truncate(stripHtml(raw.shortSummary));

  if (!shortSummary) {
    return null;
  }

  return {
    sourceCompany: raw.sourceCompany,
    externalJobId: raw.externalJobId,
    slug: buildStableJobSlug(raw),
    title: truncate(collapseWhitespace(raw.title), 180),
    roleFamily,
    level: truncate(deriveLevel(raw.title, raw.levelHint), 50),
    location: truncate(normalizeLocation(raw.location), 120),
    workMode: raw.workMode ?? "onsite",
    team: truncate(collapseWhitespace(raw.team), 120),
    shortSummary,
    officialApplyUrl: raw.officialApplyUrl,
    postedAt: parseDateToIso(raw.postedAt),
    lastVerifiedAt: new Date().toISOString(),
    status: "active",
    isFeatured: false,
  };
}

export function dedupeJobs(jobs: JobListing[]) {
  const seen = new Set<string>();

  return jobs.filter((job) => {
    const key = `${job.sourceCompany}:${job.externalJobId}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
