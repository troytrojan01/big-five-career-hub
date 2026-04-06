import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { companies, curatedJobs, getAllGuides, getGuideBySlug } from "@bigfive/content";

import { Chip } from "@/components/chip";
import { GuideCard } from "@/components/guide-card";
import { JobCard } from "@/components/job-card";
import { getGuideJobs, getRelatedGuides } from "@/lib/guides";
import { renderMdx } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: `${guide.company} interview prep for ${guide.roleFamily}.`,
    alternates: {
      canonical: absoluteUrl(`/prep/${guide.slug}`),
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const { content } = renderMdx(guide.body);
  const allGuides = getAllGuides();
  const company = companies.find((entry) => entry.slug === guide.company);
  const relatedGuides = getRelatedGuides(allGuides, guide);
  const relatedJobs = getGuideJobs(curatedJobs, guide);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: `${guide.company} interview prep guide for ${guide.roleFamily}`,
    url: absoluteUrl(`/prep/${guide.slug}`),
    author: {
      "@type": "Organization",
      name: "Big Five Career Hub",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr]">
        <article className="rounded-4xl border border-ink/10 bg-white p-8 shadow-float">
          <div className="flex flex-wrap gap-2">
            <Chip>{guide.company}</Chip>
            <Chip>{guide.roleFamily}</Chip>
            <Chip>{guide.readTime}</Chip>
          </div>
          <h1 className="mt-6 font-serif text-5xl text-ink">{guide.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate">
            Use this guide to focus your prep on the signals that matter most for this company and role family.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {guide.tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
          <div className="mt-8 grid gap-4 rounded-4xl border border-ink/10 bg-sand p-6 md:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate">Company</p>
              <p className="mt-2 font-semibold text-ink">{company?.name ?? guide.company}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate">Role family</p>
              <p className="mt-2 font-semibold text-ink">{guide.roleFamily}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate">Prep path</p>
              <p className="mt-2 font-semibold text-ink">Fundamentals, signal mapping, official sources</p>
            </div>
          </div>
          <div className="prose prose-lg mt-8 max-w-none prose-headings:font-serif prose-p:text-slate">
            {content}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {guide.sourceLinks.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-ink/10 bg-sand px-4 py-2 text-sm font-medium text-ink"
              >
                Official reference
              </a>
            ))}
          </div>
        </article>

        <aside className="space-y-8">
          <div className="rounded-4xl border border-ink/10 bg-ink p-8 text-sand shadow-float">
            <p className="text-sm uppercase tracking-[0.18em] text-sand/70">Next step</p>
            <h2 className="mt-4 text-2xl font-semibold">Turn prep into applications.</h2>
            <p className="mt-4 leading-7 text-sand/80">
              Pair this guide with active curated roles for the same company and role family, then use the company hub to map behavioral stories.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/jobs?company=${guide.company}&roleFamily=${encodeURIComponent(guide.roleFamily)}`} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-ink">
                Matching jobs
              </Link>
              <Link href={`/companies/${guide.company}`} className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-sand">
                Company hub
              </Link>
            </div>
          </div>

          {relatedJobs.length ? (
            <section>
              <h2 className="text-2xl font-semibold text-ink">Matching roles</h2>
              <div className="mt-4 grid gap-4">
                {relatedJobs.map((job) => (
                  <JobCard key={job.slug} job={job} />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h2 className="text-2xl font-semibold text-ink">Related guides</h2>
            <div className="mt-4 grid gap-4">
              {relatedGuides.map((relatedGuide) => (
                <GuideCard key={relatedGuide.slug} guide={relatedGuide} />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
