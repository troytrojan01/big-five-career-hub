import { companies, roleFamilies, type JobListing } from "@bigfive/content";

import { uniqueValues } from "@/lib/jobs";

export function JobFilters({
  jobs,
  searchParams,
}: {
  jobs: JobListing[];
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const levels = uniqueValues(jobs.map((job) => job.level));
  const locations = uniqueValues(jobs.map((job) => job.location));
  const teams = uniqueValues(jobs.map((job) => job.team));

  return (
    <form className="grid gap-4 rounded-4xl border border-ink/10 bg-white p-6 shadow-float md:grid-cols-3 xl:grid-cols-9">
      <input
        name="search"
        defaultValue={typeof searchParams.search === "string" ? searchParams.search : ""}
        placeholder="Search title, team, or keyword"
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink placeholder:text-slate md:col-span-3 xl:col-span-3"
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
      <select
        name="location"
        defaultValue={typeof searchParams.location === "string" ? searchParams.location : ""}
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink"
      >
        <option value="">All locations</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
      <select
        name="team"
        defaultValue={typeof searchParams.team === "string" ? searchParams.team : ""}
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink"
      >
        <option value="">All teams</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
      <select
        name="postedWithin"
        defaultValue={typeof searchParams.postedWithin === "string" ? searchParams.postedWithin : ""}
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink"
      >
        <option value="">Any posted date</option>
        <option value="1">Posted in 24 hours</option>
        <option value="3">Posted in 3 days</option>
        <option value="7">Posted in 7 days</option>
        <option value="14">Posted in 14 days</option>
        <option value="30">Posted in 30 days</option>
      </select>
      <select
        name="sort"
        defaultValue={typeof searchParams.sort === "string" ? searchParams.sort : ""}
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink"
      >
        <option value="">Newest posted</option>
        <option value="verified">Recently verified</option>
      </select>
      <button className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-sand transition hover:bg-ink/85">
        Apply filters
      </button>
    </form>
  );
}
