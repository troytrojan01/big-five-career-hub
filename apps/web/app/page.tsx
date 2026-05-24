import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react";

import { companies, getAllGuides } from "@bigfive/content";

import { CompanyCard } from "@/components/company-card";
import { GuideCard } from "@/components/guide-card";
import { JobCard } from "@/components/job-card";
import { SectionHeading } from "@/components/section-heading";
import { getJobs } from "@/lib/job-source";

export default async function HomePage() {
  const jobs = await getJobs();
  const featuredJobs = jobs.filter((job) => job.isFeatured).slice(0, 4);
  const featuredGuides = getAllGuides().slice(0, 6);

  return (
    <div className="pb-24">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-medium text-slate shadow-sm">
            <Sparkles className="h-4 w-4" />
            Big Tech jobs, prep, and hiring signals in one place
          </div>
          <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-tight text-ink md:text-7xl">
            The focused job search hub for Amazon, Apple, Google, Meta, and Microsoft.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-9 text-slate">
            Search curated official roles, understand how each company hires, and prepare with company-specific guides instead of scattered tabs and stale spreadsheets.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/jobs" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-medium text-sand transition hover:bg-ink/85">
              Explore jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/prep" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-6 py-3 font-medium text-ink transition hover:border-ink/30">
              Browse prep guides
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-4xl border border-ink/10 bg-white/80 p-5 shadow-sm">
              <BriefcaseBusiness className="h-5 w-5 text-ink" />
              <p className="mt-3 text-2xl font-semibold text-ink">{jobs.length}</p>
              <p className="text-sm text-slate">Curated official-role links</p>
            </div>
            <div className="rounded-4xl border border-ink/10 bg-white/80 p-5 shadow-sm">
              <GraduationCap className="h-5 w-5 text-ink" />
              <p className="mt-3 text-2xl font-semibold text-ink">{getAllGuides().length}</p>
              <p className="text-sm text-slate">Launch prep guides</p>
            </div>
            <div className="rounded-4xl border border-ink/10 bg-white/80 p-5 shadow-sm">
              <Sparkles className="h-5 w-5 text-ink" />
              <p className="mt-3 text-2xl font-semibold text-ink">5</p>
              <p className="text-sm text-slate">Big Tech company hubs</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-4xl border border-ink/10 bg-ink p-8 text-sand shadow-float">
            <p className="text-sm uppercase tracking-[0.24em] text-sand/70">Launch focus</p>
            <ul className="mt-5 space-y-4 text-base leading-7 text-sand/90">
              <li>Official apply links only</li>
              <li>Search filters and posted-date controls</li>
              <li>Interview prep across five core role families</li>
              <li>Built for later mobile alerts and saved jobs</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading
          eyebrow="Companies"
          title="Company hubs for Amazon, Apple, Google, Meta, and Microsoft."
          description="Jump from live roles to values, interview prep, and official hiring resources without leaving the product."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {companies.map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured roles"
            title="Fresh, curated roles with direct paths to official applications."
            description="Every listing includes its verification timestamp, core context, and a prep path connected to the role family."
          />
          <Link href="/jobs" className="hidden text-sm font-medium text-ink md:inline-flex">
            See all jobs
          </Link>
        </div>
        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          {featuredJobs.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Prep library"
            title="Focused playbooks for the five role families that drive the most intent."
            description="Start with company-specific guide pages for software, product, data, design, and TPM paths."
          />
          <Link href="/prep" className="hidden text-sm font-medium text-ink md:inline-flex">
            See all guides
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>
    </div>
  );
}
