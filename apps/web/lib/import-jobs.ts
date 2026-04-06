import { parse } from "csv-parse/sync";
import slugify from "slugify";
import { z } from "zod";

import type { JobListing } from "@bigfive/content";

import { getJobStatus } from "./jobs";

const importJobSchema = z.object({
  sourceCompany: z.enum(["amazon", "apple", "google", "meta", "microsoft"]),
  externalJobId: z.string().min(1),
  title: z.string().min(1),
  roleFamily: z.string().min(1),
  level: z.string().min(1),
  location: z.string().min(1),
  workMode: z.enum(["remote", "hybrid", "onsite"]),
  team: z.string().min(1),
  shortSummary: z.string().min(1),
  officialApplyUrl: z.string().url(),
  postedAt: z.string().datetime(),
  lastVerifiedAt: z.string().datetime(),
  status: z.enum(["active", "inactive"]).default("active"),
  isFeatured: z.coerce.boolean().optional().default(false),
});

export interface ImportPreview {
  total: number;
  valid: number;
  invalid: number;
  inserted: number;
  jobs: JobListing[];
  errors: string[];
}

function withSlug(input: z.infer<typeof importJobSchema>): JobListing {
  return {
    ...input,
    slug: slugify(`${input.sourceCompany}-${input.title}-${input.team}`, {
      lower: true,
      strict: true,
      trim: true,
    }),
    status: getJobStatus(
      {
        ...input,
        slug: "",
      } as JobListing,
      new Date(),
    ),
  };
}

export function parseImportText(text: string, format: "csv" | "json"): ImportPreview {
  const rows =
    format === "json"
      ? (JSON.parse(text) as Record<string, unknown>[])
      : (parse(text, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        }) as Record<string, unknown>[]);

  const jobs: JobListing[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    const parsed = importJobSchema.safeParse(row);

    if (!parsed.success) {
      errors.push(`Row ${index + 1}: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`);
      return;
    }

    jobs.push(withSlug(parsed.data));
  });

  return {
    total: rows.length,
    valid: jobs.length,
    invalid: errors.length,
    inserted: 0,
    jobs,
    errors,
  };
}
