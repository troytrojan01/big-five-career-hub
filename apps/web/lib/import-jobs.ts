import { parse } from "csv-parse/sync";
import slugify from "slugify";
import { z } from "zod";

import type { JobListing } from "@bigfive/content";

const officialCompanyHosts: Record<string, string[]> = {
  amazon: ["amazon.jobs", "www.amazon.jobs"],
  apple: ["jobs.apple.com", "www.apple.com"],
  google: ["careers.google.com", "google.com", "www.google.com"],
  meta: ["metacareers.com", "www.metacareers.com"],
  microsoft: ["careers.microsoft.com"],
};

const csvBoolean = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return value;
}, z.boolean());

const importJobSchema = z.object({
  sourceCompany: z.enum(["amazon", "apple", "google", "meta", "microsoft"]),
  externalJobId: z.string().trim().min(1),
  title: z.string().trim().min(1),
  roleFamily: z.string().trim().min(1),
  level: z.string().trim().min(1),
  location: z.string().trim().min(1),
  workMode: z.enum(["remote", "hybrid", "onsite"]),
  team: z.string().trim().min(1),
  shortSummary: z.string().trim().min(1),
  officialApplyUrl: z.string().trim().url(),
  postedAt: z.string().datetime(),
  lastVerifiedAt: z.string().datetime(),
  status: z.enum(["active", "inactive"]).default("active"),
  isFeatured: csvBoolean.optional().default(false),
});

export interface ImportPreview {
  total: number;
  valid: number;
  invalid: number;
  inserted: number;
  jobs: JobListing[];
  errors: string[];
  warnings: string[];
  inactive: number;
  duplicates: number;
}

function withSlug(input: z.infer<typeof importJobSchema>): JobListing {
  return {
    ...input,
    slug: slugify(`${input.sourceCompany}-${input.title}-${input.team}-${input.externalJobId}`, {
      lower: true,
      strict: true,
      trim: true,
    }),
  };
}

function assertRows(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Error("JSON imports must be an array of job rows.");
  }

  return value as Record<string, unknown>[];
}

function getOfficialDomainWarning(job: JobListing) {
  const allowedHosts = officialCompanyHosts[job.sourceCompany];
  const host = new URL(job.officialApplyUrl).hostname.toLowerCase();

  if (allowedHosts.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`))) {
    return null;
  }

  return `${job.title}: apply URL host "${host}" does not match expected ${job.sourceCompany} career domains.`;
}

export function parseImportText(text: string, format: "csv" | "json"): ImportPreview {
  const rows =
    format === "json"
      ? assertRows(JSON.parse(text))
      : (parse(text, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        }) as Record<string, unknown>[]);

  const jobs: JobListing[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenJobIds = new Set<string>();
  const seenSlugs = new Set<string>();
  let duplicates = 0;

  rows.forEach((row, index) => {
    const parsed = importJobSchema.safeParse(row);

    if (!parsed.success) {
      errors.push(`Row ${index + 1}: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`);
      return;
    }

    const job = withSlug(parsed.data);
    const jobIdKey = `${job.sourceCompany}:${job.externalJobId}`;

    if (seenJobIds.has(jobIdKey) || seenSlugs.has(job.slug)) {
      duplicates += 1;
      errors.push(`Row ${index + 1}: duplicate job key or slug (${jobIdKey}).`);
      return;
    }

    const domainWarning = getOfficialDomainWarning(job);
    if (domainWarning) {
      warnings.push(`Row ${index + 1}: ${domainWarning}`);
    }

    seenJobIds.add(jobIdKey);
    seenSlugs.add(job.slug);
    jobs.push(job);
  });

  return {
    total: rows.length,
    valid: jobs.length,
    invalid: errors.length,
    inserted: 0,
    jobs,
    errors,
    warnings,
    inactive: jobs.filter((job) => job.status === "inactive").length,
    duplicates,
  };
}
