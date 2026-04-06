import { sql } from "drizzle-orm";
import { companies as contentCompanies, curatedJobs } from "@bigfive/content";

import { closeDb, getDb } from "./client";
import { companies, jobListings } from "./schema";

async function seedCompanies() {
  const db = getDb();

  await db
    .insert(companies)
    .values(
      contentCompanies.map((company) => ({
        slug: company.slug,
        name: company.name,
        careersUrl: company.careersUrl,
        principlesSummary: company.principlesSummary,
        hiringProcessSummary: company.hiringProcessSummary,
      })),
    )
    .onConflictDoUpdate({
      target: companies.slug,
      set: {
        name: sql`excluded.name`,
        careersUrl: sql`excluded.careers_url`,
        principlesSummary: sql`excluded.principles_summary`,
        hiringProcessSummary: sql`excluded.hiring_process_summary`,
        updatedAt: new Date(),
      },
    });

  return contentCompanies.length;
}

async function seedJobs() {
  const db = getDb();

  await db
    .insert(jobListings)
    .values(
      curatedJobs.map((job) => ({
        ...job,
        postedAt: new Date(job.postedAt),
        lastVerifiedAt: new Date(job.lastVerifiedAt),
      })),
    )
    .onConflictDoUpdate({
      target: [jobListings.sourceCompany, jobListings.externalJobId],
      set: {
        slug: sql`excluded.slug`,
        title: sql`excluded.title`,
        roleFamily: sql`excluded.role_family`,
        level: sql`excluded.level`,
        location: sql`excluded.location`,
        workMode: sql`excluded.work_mode`,
        team: sql`excluded.team`,
        shortSummary: sql`excluded.short_summary`,
        officialApplyUrl: sql`excluded.official_apply_url`,
        postedAt: sql`excluded.posted_at`,
        lastVerifiedAt: sql`excluded.last_verified_at`,
        status: sql`excluded.status`,
        isFeatured: sql`excluded.is_featured`,
        updatedAt: new Date(),
      },
    });

  return curatedJobs.length;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const companyCount = await seedCompanies();
  const jobCount = await seedJobs();

  console.log(`Seeded ${companyCount} companies and ${jobCount} jobs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await closeDb();
});
