import { and, eq } from "drizzle-orm";

import { closeDb, companies, getDb, jobListings, waitlistSignups } from "@bigfive/db";

import { parseImportText } from "../apps/web/lib/import-jobs";

const runId = new Date().toISOString().replace(/[-:.TZ]/g, "");
const smokeEmail = `smoke+${runId}@bigfivecareerhub.test`;
const smokeExternalJobId = `smoke-${runId}`;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for the live database smoke test.");
  }

  const db = getDb();

  try {
    const companyRows = await db.select({ slug: companies.slug }).from(companies);
    if (companyRows.length < 5) {
      throw new Error(`Expected at least 5 seeded companies, found ${companyRows.length}.`);
    }

    const seededJobs = await db.select({ slug: jobListings.slug }).from(jobListings).limit(1);
    if (!seededJobs.length) {
      throw new Error("Expected at least one seeded job listing.");
    }

    await db.insert(waitlistSignups).values({
      email: smokeEmail,
      source: "smoke-test",
    });

    const waitlistRows = await db
      .select({ email: waitlistSignups.email })
      .from(waitlistSignups)
      .where(eq(waitlistSignups.email, smokeEmail))
      .limit(1);

    if (waitlistRows[0]?.email !== smokeEmail) {
      throw new Error("Waitlist signup smoke insert was not readable.");
    }

    const now = new Date().toISOString();
    const importPreview = parseImportText(
      JSON.stringify([
        {
          sourceCompany: "google",
          externalJobId: smokeExternalJobId,
          title: "Smoke Test Software Engineer",
          roleFamily: "Software Engineering",
          level: "L4",
          location: "New York, NY",
          workMode: "hybrid",
          team: "Platform",
          shortSummary: "Temporary smoke test role used to verify database-backed admin imports.",
          officialApplyUrl: "https://www.google.com/about/careers/applications/jobs/results",
          postedAt: now,
          lastVerifiedAt: now,
          status: "active",
          isFeatured: false,
        },
      ]),
      "json",
    );

    if (importPreview.valid !== 1 || importPreview.jobs.length !== 1) {
      throw new Error(`Expected one valid import job, found ${importPreview.valid}.`);
    }

    await db.insert(jobListings).values(
      importPreview.jobs.map((job) => ({
        ...job,
        postedAt: new Date(job.postedAt),
        lastVerifiedAt: new Date(job.lastVerifiedAt),
      })),
    );

    const smokeJobs = await db
      .select({ slug: jobListings.slug })
      .from(jobListings)
      .where(and(eq(jobListings.sourceCompany, "google"), eq(jobListings.externalJobId, smokeExternalJobId)))
      .limit(1);

    if (!smokeJobs[0]?.slug) {
      throw new Error("Admin import smoke insert was not readable.");
    }

    console.log(
      `Live DB smoke test passed: ${companyRows.length} companies, waitlist write/read/delete, admin import write/read/delete.`,
    );
  } finally {
    await db
      .delete(jobListings)
      .where(and(eq(jobListings.sourceCompany, "google"), eq(jobListings.externalJobId, smokeExternalJobId)));

    await db.delete(waitlistSignups).where(eq(waitlistSignups.email, smokeEmail));
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await closeDb();
  });
