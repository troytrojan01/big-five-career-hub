import Link from "next/link";

import type { JobListing } from "@bigfive/content";

import { Chip } from "@/components/chip";
import { getApplyLinkQuality } from "@/lib/jobs";
import { formatDate } from "@/lib/utils";

export function JobCard({ job }: { job: JobListing }) {
  const applyLinkQuality = getApplyLinkQuality(job);

  return (
    <article className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float transition hover:-translate-y-1">
      <div className="flex flex-wrap gap-2">
        <Chip className="bg-coral">{job.sourceCompany}</Chip>
        <Chip>{job.roleFamily}</Chip>
        <Chip>{job.level}</Chip>
        <Chip>{job.workMode}</Chip>
        <Chip className={applyLinkQuality.kind === "exact" ? "bg-mint" : "bg-coral"}>
          {applyLinkQuality.label}
        </Chip>
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-ink">{job.title}</h3>
      <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate">{job.team}</p>
      <p className="mt-4 text-base leading-7 text-slate">{job.shortSummary}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-slate">
        <div>
          <p>{job.location}</p>
          <p>Verified {formatDate(job.lastVerifiedAt)}</p>
        </div>
        <Link
          href={`/jobs/${job.slug}`}
          className="rounded-full bg-ink px-5 py-3 font-medium text-sand transition hover:bg-ink/85"
        >
          View role
        </Link>
      </div>
    </article>
  );
}
