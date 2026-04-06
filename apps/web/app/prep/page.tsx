import type { Metadata } from "next";

import { companies, getAllGuides, roleFamilies } from "@bigfive/content";

import { GuideFilters } from "@/components/guide-filters";
import { GuideCard } from "@/components/guide-card";
import { SectionHeading } from "@/components/section-heading";
import { filterGuides, getCompanyGuideCoverage } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Interview Prep",
  description: "Company-specific Big Tech interview prep guides across five role families.",
};

export default async function PrepPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const guides = getAllGuides();
  const filteredGuides = filterGuides(guides, {
    company: typeof params.company === "string" ? params.company : undefined,
    roleFamily: typeof params.roleFamily === "string" ? params.roleFamily : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Interview prep"
        title="Twenty-five launch guides across the highest-intent role families."
        description="Each guide is tied to one of the five companies and one of the five launch role families so users can prepare with more context than a generic interview checklist."
      />

      <div className="mt-10 flex flex-wrap gap-2">
        {roleFamilies.map((roleFamily) => (
          <span key={roleFamily} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-slate">
            {roleFamily}
          </span>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-5">
        {companies.map((company) => (
          <div key={company.slug} className="rounded-4xl border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-slate">{company.name}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{getCompanyGuideCoverage(guides, company.slug)}</p>
            <p className="mt-1 text-sm text-slate">launch guides</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <GuideFilters searchParams={params} />
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-slate">
        <p>{filteredGuides.length} guides</p>
        <p>Original, source-linked prep content</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredGuides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
      {!filteredGuides.length ? (
        <div className="mt-12 rounded-4xl border border-dashed border-ink/20 bg-white/70 p-8 text-slate">
          No prep guides matched those filters. Try a broader company, role family, or keyword search.
        </div>
      ) : null}
    </div>
  );
}
