import type { Metadata } from "next";

import { JobCard } from "@/components/job-card";
import { JobFilters } from "@/components/job-filters";
import { SectionHeading } from "@/components/section-heading";
import { getJobs } from "@/lib/job-source";
import { filterJobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Curated US-first Big Tech roles from Amazon, Apple, Google, Meta, and Microsoft.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const allJobs = await getJobs();
  const jobs = filterJobs(allJobs, {
    company: typeof params.company === "string" ? params.company : undefined,
    level: typeof params.level === "string" ? params.level : undefined,
    location: typeof params.location === "string" ? params.location : undefined,
    roleFamily: typeof params.roleFamily === "string" ? params.roleFamily : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    sort: typeof params.sort === "string" ? params.sort : undefined,
    team: typeof params.team === "string" ? params.team : undefined,
    workMode: typeof params.workMode === "string" ? params.workMode : undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Jobs"
        title="Curated Big Five roles with clean filters and official apply links."
        description="Search by company, role family, level, location, team, and work mode. Stale roles automatically drop out once they fall outside the verification window."
      />
      <div className="mt-10">
        <JobFilters jobs={allJobs} searchParams={params} />
      </div>
      <div className="mt-10 flex items-center justify-between text-sm text-slate">
        <p>{jobs.length} active roles</p>
        <p>Freshness window: 48 hours</p>
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.slug} job={job} />
        ))}
      </div>
      {!jobs.length ? (
        <div className="mt-12 rounded-4xl border border-dashed border-ink/20 bg-white/70 p-8 text-slate">
          No roles matched these filters. Try broadening the company, level, or role family selection.
        </div>
      ) : null}
    </div>
  );
}
