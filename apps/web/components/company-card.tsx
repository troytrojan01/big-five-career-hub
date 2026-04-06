import Link from "next/link";

import type { CompanyRecord } from "@bigfive/content";

export function CompanyCard({ company }: { company: CompanyRecord }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float transition hover:-translate-y-1"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold text-white" style={{ backgroundColor: company.accent }}>
        {company.name.slice(0, 1)}
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-ink">{company.name}</h3>
      <p className="mt-3 leading-7 text-slate">{company.principlesSummary}</p>
      <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-slate">Explore company hub</p>
    </Link>
  );
}
