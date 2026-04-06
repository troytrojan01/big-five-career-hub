import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { companies, curatedJobs, getAllCompanyHubs, getAllGuides } from "@bigfive/content";

import { Chip } from "@/components/chip";
import { GuideCard } from "@/components/guide-card";
import { JobCard } from "@/components/job-card";
import { renderMdx } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllCompanyHubs().map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = getAllCompanyHubs().find((entry) => entry.slug === slug);

  if (!company) {
    return {};
  }

  return {
    title: `${company.title} company hub`,
    description: company.summary,
    alternates: {
      canonical: absoluteUrl(`/companies/${company.slug}`),
    },
  };
}

export default async function CompanyHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getAllCompanyHubs().find((entry) => entry.slug === slug);

  if (!company) {
    notFound();
  }

  const companyRecord = companies.find((entry) => entry.slug === slug);
  const relatedJobs = curatedJobs.filter((job) => job.sourceCompany === slug).slice(0, 3);
  const relatedGuides = getAllGuides().filter((guide) => guide.company === slug);
  const { content } = await renderMdx(company.body);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-4xl border border-ink/10 bg-white p-8 shadow-float">
          <div
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold text-white"
            style={{ backgroundColor: companyRecord?.accent }}
          >
            {company.title.slice(0, 1)}
          </div>
          <h1 className="mt-6 font-serif text-5xl text-ink">{company.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate">{company.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {company.principles.map((principle) => (
              <Chip key={principle}>{principle}</Chip>
            ))}
          </div>
          <div className="prose prose-lg mt-8 max-w-none prose-headings:font-serif prose-p:text-slate">
            {content}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {company.sourceLinks.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-ink/10 bg-sand px-4 py-2 text-sm font-medium text-ink"
              >
                Official source
              </a>
            ))}
          </div>
        </article>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-ink">Open roles</h2>
            <div className="mt-5 grid gap-6">
              {relatedJobs.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-ink">Prep guides</h2>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {relatedGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
