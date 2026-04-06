import Link from "next/link";

import { companies, curatedJobs } from "@bigfive/content";

import { Chip } from "@/components/chip";
import { SectionHeading } from "@/components/section-heading";
import { getApplyLinkQuality, getJobDataQualityWarnings, getJobFreshnessLabel, getJobStatus } from "@/lib/jobs";
import { formatDate } from "@/lib/utils";

export default function AdminJobsPage() {
  const now = new Date();
  const activeJobs = curatedJobs.filter((job) => getJobStatus(job, now) === "active");
  const staleJobs = curatedJobs.filter((job) => getJobStatus(job, now) === "inactive");
  const featuredJobs = curatedJobs.filter((job) => job.isFeatured);
  const jobsNeedingLinkReview = curatedJobs.filter((job) => getApplyLinkQuality(job).kind !== "exact");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Admin"
        title="Curated job operations dashboard."
        description="Use this no-database dashboard to inspect launch seed jobs, spot stale listings, and jump into the import workflow before we wire Postgres as the source of truth."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <div className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float">
          <p className="text-sm uppercase tracking-[0.18em] text-slate">Total</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{curatedJobs.length}</p>
        </div>
        <div className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float">
          <p className="text-sm uppercase tracking-[0.18em] text-slate">Active</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{activeJobs.length}</p>
        </div>
        <div className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float">
          <p className="text-sm uppercase tracking-[0.18em] text-slate">Needs recheck</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{staleJobs.length}</p>
        </div>
        <div className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float">
          <p className="text-sm uppercase tracking-[0.18em] text-slate">Featured</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{featuredJobs.length}</p>
        </div>
        <div className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float md:col-span-4">
          <p className="text-sm uppercase tracking-[0.18em] text-slate">Link review queue</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{jobsNeedingLinkReview.length}</p>
          <p className="mt-2 text-sm text-slate">
            Roles using official search or generic careers pages should be upgraded to exact official job URLs before launch.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/import" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-sand">
          Import curated jobs
        </Link>
        <Link href="/jobs" className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-medium text-ink">
          View public jobs page
        </Link>
      </div>

      <section className="mt-12 overflow-hidden rounded-4xl border border-ink/10 bg-white shadow-float">
        <div className="border-b border-ink/10 p-6">
          <h2 className="text-2xl font-semibold text-ink">Launch job inventory</h2>
          <p className="mt-2 text-sm text-slate">Freshness is calculated from `lastVerifiedAt` with a 48-hour active window.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead className="bg-sand text-slate">
              <tr>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Family</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Verified</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Links</th>
              </tr>
            </thead>
            <tbody>
              {curatedJobs.map((job) => {
                const company = companies.find((entry) => entry.slug === job.sourceCompany);
                const status = getJobStatus(job, now);
                const applyLinkQuality = getApplyLinkQuality(job);
                const dataQualityWarnings = getJobDataQualityWarnings(job, now);

                return (
                  <tr key={job.slug} className="border-t border-ink/10 align-top">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{job.title}</p>
                      <p className="mt-1 text-slate">{job.team}</p>
                    </td>
                    <td className="px-6 py-4 text-slate">{company?.name ?? job.sourceCompany}</td>
                    <td className="px-6 py-4 text-slate">{job.roleFamily}</td>
                    <td className="px-6 py-4 text-slate">{job.location}</td>
                    <td className="px-6 py-4 text-slate">{formatDate(job.lastVerifiedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <Chip className={status === "active" ? "bg-mint" : "bg-coral"}>
                          {getJobFreshnessLabel(job, now)}
                        </Chip>
                        <Chip className={applyLinkQuality.kind === "exact" ? "bg-mint" : "bg-coral"}>
                          {applyLinkQuality.label}
                        </Chip>
                        {dataQualityWarnings.length ? (
                          <p className="max-w-xs text-xs leading-5 text-slate">{dataQualityWarnings.join(" ")}</p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/jobs/${job.slug}`} className="rounded-full border border-ink/10 px-3 py-1 text-xs font-medium text-ink">
                          Detail
                        </Link>
                        <a
                          href={job.officialApplyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-ink/10 px-3 py-1 text-xs font-medium text-ink"
                        >
                          Official
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
