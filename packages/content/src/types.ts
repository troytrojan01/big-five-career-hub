export type CompanySlug = "amazon" | "apple" | "google" | "meta" | "microsoft";
export type WorkMode = "remote" | "hybrid" | "onsite";
export type JobStatus = "active" | "inactive";

export interface CompanyRecord {
  slug: CompanySlug;
  name: string;
  careersUrl: string;
  principlesSummary: string;
  hiringProcessSummary: string;
  accent: string;
}

export interface JobListing {
  sourceCompany: CompanySlug;
  externalJobId: string;
  slug: string;
  title: string;
  roleFamily: string;
  level: string;
  location: string;
  workMode: WorkMode;
  team: string;
  shortSummary: string;
  officialApplyUrl: string;
  postedAt: string;
  lastVerifiedAt: string;
  status: JobStatus;
  isFeatured?: boolean;
}

export interface ResourceLink {
  title: string;
  company?: CompanySlug;
  resourceType: "official" | "guide" | "principles" | "interview";
  officialOrThirdParty: "official" | "third-party";
  url: string;
  tags: string[];
}

export interface CompanyFrontmatter {
  slug: CompanySlug;
  title: string;
  summary: string;
  principles: string[];
  sourceLinks: string[];
}

export interface GuideFrontmatter {
  slug: string;
  title: string;
  company: CompanySlug;
  roleFamily: string;
  guideType: "prep";
  readTime: string;
  tags: string[];
  sourceLinks: string[];
}
