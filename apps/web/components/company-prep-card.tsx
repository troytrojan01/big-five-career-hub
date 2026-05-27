import Link from "next/link";

import type { CompanyRecord, GuideFrontmatter, ResourceLink } from "@bigfive/content";

import { Chip } from "@/components/chip";

export function CompanyPrepCard({
  company,
  guides,
  resources,
}: {
  company: CompanyRecord;
  guides: GuideFrontmatter[];
  resources: ResourceLink[];
}) {
  const companyGuides = guides.filter((guide) => guide.company === company.slug);
  const companyResources = resources.filter((resource) => resource.company === company.slug);

  return (
    <article className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float">
      <div className="flex items-start gap-4">
        <div
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white"
          style={{ backgroundColor: company.accent }}
        >
          {company.name.slice(0, 1)}
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-ink">{company.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate">{company.hiringProcessSummary}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip>{companyResources.length} official links</Chip>
        <Chip>{companyGuides.length} editorial notes</Chip>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate">Official material</p>
        <div className="mt-3 grid gap-2">
          {companyResources.map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm font-medium text-ink transition hover:border-ink/25"
            >
              {resource.title}
            </a>
          ))}
        </div>
      </div>

      <Link
        href={`/companies/${company.slug}`}
        className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-sand transition hover:bg-ink/85"
      >
        Open company hub
      </Link>
    </article>
  );
}
