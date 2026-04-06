import type { CompanySlug, GuideFrontmatter, JobListing } from "@bigfive/content";

export interface GuideFilters {
  company?: string;
  roleFamily?: string;
  search?: string;
}

export function filterGuides(guides: GuideFrontmatter[], filters: GuideFilters) {
  const normalizedSearch = filters.search?.trim().toLowerCase();

  return guides.filter((guide) => {
    if (filters.company && guide.company !== filters.company) {
      return false;
    }

    if (filters.roleFamily && guide.roleFamily !== filters.roleFamily) {
      return false;
    }

    if (normalizedSearch) {
      return [guide.title, guide.company, guide.roleFamily, ...guide.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    }

    return true;
  });
}

export function getRelatedGuides(
  guides: GuideFrontmatter[],
  target: Pick<GuideFrontmatter, "slug" | "company" | "roleFamily">,
) {
  return guides
    .filter((guide) => guide.slug !== target.slug)
    .map((guide) => {
      const score = Number(guide.company === target.company) + Number(guide.roleFamily === target.roleFamily);
      return { guide, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.guide.title.localeCompare(b.guide.title))
    .map((entry) => entry.guide)
    .slice(0, 4);
}

export function getGuideJobs(
  jobs: JobListing[],
  guide: Pick<GuideFrontmatter, "company" | "roleFamily">,
) {
  return jobs
    .filter((job) => job.sourceCompany === guide.company && job.roleFamily === guide.roleFamily)
    .slice(0, 3);
}

export function getCompanyGuideCoverage(guides: GuideFrontmatter[], company: CompanySlug) {
  return guides.filter((guide) => guide.company === company).length;
}
