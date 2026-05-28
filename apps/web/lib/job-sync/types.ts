import type { CompanySlug, JobListing, WorkMode } from "@bigfive/content";

export type TargetRoleFamily =
  | "Software Engineering"
  | "Product Management"
  | "Data / ML"
  | "Design / UX"
  | "TPM / Program Management"
  | "Solutions & Security";

export interface RawSyncJob {
  sourceCompany: CompanySlug;
  externalJobId: string;
  title: string;
  team: string;
  location: string;
  workMode?: WorkMode;
  shortSummary: string;
  officialApplyUrl: string;
  postedAt: string;
  levelHint?: string | null;
  roleFamilyHint?: string | null;
}

export interface CompanySyncResult {
  company: CompanySlug;
  fetchedCount: number;
  importedCount: number;
  insertedCount: number;
  updatedCount: number;
  inactivatedCount: number;
}

export interface JobSyncAdapter {
  company: CompanySlug;
  deactivateMissing?: boolean;
  fetchJobs(): Promise<JobListing[]>;
}
