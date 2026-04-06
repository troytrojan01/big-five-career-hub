import { companies, curatedJobs, roleFamilies } from "@bigfive/content";

import { uniqueValues } from "@/lib/jobs";

export function JobFilters({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const levels = uniqueValues(curatedJobs.map((job) => job.level));

  return (
    <form className="grid gap-4 rounded-4xl border border-ink/10 bg-white p-6 shadow-float md:grid-cols-3 xl:grid-cols-6">
      <input
        name="search"
        defaultValue={typeof searchParams.search === "string" ? searchParams.search : ""}
        placeholder="Search title, team, or keyword"
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink placeholder:text-slate md:col-span-3 xl:col-span-2"
      />
      <select
        name="company"
        defaultValue={typeof searchParams.company === "string" ? searchParams.company : ""}
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink"
      >
        <option value="">All companies</option>
        {companies.map((company) => (
          <option key={company.slug} value={company.slug}>
            {company.name}
          </option>
        ))}
      </select>
      <select
        name="roleFamily"
        defaultValue={typeof searchParams.roleFamily === "string" ? searchParams.roleFamily : ""}
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink"
      >
        <option value="">All role families</option>
        {roleFamilies.map((roleFamily) => (
          <option key={roleFamily} value={roleFamily}>
            {roleFamily}
          </option>
        ))}
      </select>
      <select
        name="level"
        defaultValue={typeof searchParams.level === "string" ? searchParams.level : ""}
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink"
      >
        <option value="">All levels</option>
        {levels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      <select
        name="workMode"
        defaultValue={typeof searchParams.workMode === "string" ? searchParams.workMode : ""}
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink"
      >
        <option value="">Any work mode</option>
        <option value="remote">Remote</option>
        <option value="hybrid">Hybrid</option>
        <option value="onsite">Onsite</option>
      </select>
      <button className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-sand transition hover:bg-ink/85">
        Apply filters
      </button>
    </form>
  );
}
