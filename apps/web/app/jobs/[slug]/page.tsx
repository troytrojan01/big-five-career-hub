import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { companies, getAllGuides } from "@bigfive/content";

import { ApplyButton } from "@/components/apply-button";
import { Chip } from "@/components/chip";
import { GuideCard } from "@/components/guide-card";
import { getJobBySlug, getJobs } from "@/lib/job-source";
import { getApplyLinkQuality, getJobDataQualityWarnings } from "@/lib/jobs";
import { formatDate, absoluteUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {};
  }

  return {
    title: `${job.title} at ${job.sourceCompany}`,
    description: job.shortSummary,
    alternates: {
      canonical: absoluteUrl(`/jobs/${job.slug}`),
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const company = companies.find((entry) => entry.slug === job.sourceCompany);
  const applyLinkQuality = getApplyLinkQuality(job);
  const dataQualityWarnings = getJobDataQualityWarnings(job);
  const relatedGuides = getAllGuides().filter(
    (guide) => guide.company === job.sourceCompany || guide.roleFamily === job.roleFamily,
  ).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.shortSummary,
    datePosted: job.postedAt,
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: company?.name ?? job.sourceCompany,
      sameAs: company?.careersUrl ?? job.officialApplyUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "US",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "United States",
    },
    directApply: true,
    url: absoluteUrl(`/jobs/${job.slug}`),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-4xl border border-ink/10 bg-white p-8 shadow-float">
          <div className="flex flex-wrap gap-2">
            <Chip className="bg-coral">{job.sourceCompany}</Chip>
            <Chip>{job.roleFamily}</Chip>
            <Chip>{job.level}</Chip>
            <Chip>{job.workMode}</Chip>
            <Chip className={applyLinkQuality.kind === "exact" ? "bg-mint" : "bg-coral"}>
              {applyLinkQuality.label}
            </Chip>
          </div>
          <h1 className="mt-6 font-serif text-5xl text-ink">{job.title}</h1>
          <p className="mt-3 text-lg text-slate">{job.team}</p>
          <p className="mt-6 text-lg leading-8 text-slate">{job.shortSummary}</p>
          <dl className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <dt className="text-sm uppercase tracking-[0.18em] text-slate">Location</dt>
              <dd className="mt-2 text-base text-ink">{job.location}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.18em] text-slate">Posted</dt>
              <dd className="mt-2 text-base text-ink">{formatDate(job.postedAt)}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.18em] text-slate">Verification</dt>
              <dd className="mt-2 text-base text-ink">{formatDate(job.lastVerifiedAt)}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.18em] text-slate">Apply path</dt>
              <dd className="mt-2 text-base text-ink">{applyLinkQuality.label}</dd>
            </div>
          </dl>
          {dataQualityWarnings.length ? (
            <div className="mt-8 rounded-3xl border border-ink/10 bg-coral p-5 text-sm leading-7 text-ink">
              <p className="font-semibold">Before applying</p>
              <ul className="mt-2 space-y-2">
                {dataQualityWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-10">
            <ApplyButton href={job.officialApplyUrl} company={job.sourceCompany} title={job.title} />
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-4xl border border-ink/10 bg-ink p-8 text-sand shadow-float">
            <p className="text-sm uppercase tracking-[0.18em] text-sand/70">Company context</p>
            <h2 className="mt-4 text-2xl font-semibold">{company?.name}</h2>
            <p className="mt-4 leading-7 text-sand/80">{company?.hiringProcessSummary}</p>
            <a
              href={`/companies/${company?.slug ?? job.sourceCompany}`}
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-ink"
            >
              Explore company hub
            </a>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-ink">Related prep</h2>
            <div className="mt-4 grid gap-4">
              {relatedGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
