import type { Metadata } from "next";

import { companies, resources } from "@bigfive/content";

import { Chip } from "@/components/chip";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Resources",
  description: "Official hiring resources, principles, and prep links across the Big Five.",
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Resources"
        title="Official hiring materials plus curated guidance, all organized by company."
        description="The library keeps source links explicit so candidates can move from our editorial guidance to the official employer material without friction."
      />
      <div className="mt-10 grid gap-8">
        {companies.map((company) => {
          const companyResources = resources.filter((resource) => resource.company === company.slug);

          return (
            <section key={company.slug} className="rounded-4xl border border-ink/10 bg-white p-8 shadow-float">
              <div className="flex items-center gap-4">
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold text-white"
                  style={{ backgroundColor: company.accent }}
                >
                  {company.name.slice(0, 1)}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-ink">{company.name}</h2>
                  <p className="text-sm text-slate">{company.hiringProcessSummary}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {companyResources.map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.url}
                    target={resource.url.startsWith("http") ? "_blank" : undefined}
                    rel={resource.url.startsWith("http") ? "noreferrer" : undefined}
                    className="rounded-3xl border border-ink/10 bg-sand p-5 transition hover:border-ink/25"
                  >
                    <div className="flex flex-wrap gap-2">
                      <Chip>{resource.resourceType}</Chip>
                      <Chip>{resource.officialOrThirdParty}</Chip>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-ink">{resource.title}</h3>
                    <p className="mt-3 text-sm text-slate">{resource.tags.join(" • ")}</p>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
