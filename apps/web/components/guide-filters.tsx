import { companies, roleFamilies } from "@bigfive/content";

export function GuideFilters({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <form className="grid gap-4 rounded-4xl border border-ink/10 bg-white p-6 shadow-float md:grid-cols-4">
      <input
        name="search"
        defaultValue={typeof searchParams.search === "string" ? searchParams.search : ""}
        placeholder="Search prep topic or keyword"
        className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink placeholder:text-slate md:col-span-2"
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
      <button className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-sand transition hover:bg-ink/85 md:col-span-4">
        Apply guide filters
      </button>
    </form>
  );
}
