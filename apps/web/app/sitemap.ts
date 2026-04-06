import { companies, curatedJobs, getAllGuides } from "@bigfive/content";
import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/jobs", "/prep", "/resources", "/admin/jobs", "/admin/import"];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: new Date(),
    })),
    ...companies.map((company) => ({
      url: absoluteUrl(`/companies/${company.slug}`),
      lastModified: new Date(),
    })),
    ...curatedJobs.map((job) => ({
      url: absoluteUrl(`/jobs/${job.slug}`),
      lastModified: new Date(job.lastVerifiedAt),
    })),
    ...getAllGuides().map((guide) => ({
      url: absoluteUrl(`/prep/${guide.slug}`),
      lastModified: new Date(),
    })),
  ];
}
