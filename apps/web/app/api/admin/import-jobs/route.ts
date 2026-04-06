import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { getDb, jobListings } from "@bigfive/db";

import type { ImportPreview } from "@/lib/import-jobs";
import { parseImportText } from "@/lib/import-jobs";

export async function POST(request: Request) {
  let preview: ImportPreview = {
    total: 0,
    valid: 0,
    invalid: 0,
    inserted: 0,
    jobs: [],
    errors: [],
    warnings: [],
    stale: 0,
    duplicates: 0,
  };

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const format = formData.get("format");
    const shouldCommit = formData.get("commit") === "true";

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "A CSV or JSON file is required." }, { status: 400 });
    }

    if (format !== "csv" && format !== "json") {
      return NextResponse.json({ message: "Format must be csv or json." }, { status: 400 });
    }

    preview = parseImportText(await file.text(), format);

    if (!shouldCommit) {
      return NextResponse.json({
        ...preview,
        message: "Validation complete. No rows were written.",
      });
    }

    const db = getDb();
    if (!preview.jobs.length) {
      return NextResponse.json({
        ...preview,
        message: "No valid rows to insert.",
      });
    }

    await db
      .insert(jobListings)
      .values(
        preview.jobs.map((job) => ({
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

    return NextResponse.json({
      ...preview,
      inserted: preview.jobs.length,
      message: `Imported or updated ${preview.jobs.length} roles in PostgreSQL.`,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("DATABASE_URL")) {
      return NextResponse.json(
        {
          ...preview,
          message: "DATABASE_URL is missing. Validation still works, but persistence is disabled.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        total: 0,
        valid: 0,
        invalid: 1,
        inserted: 0,
        jobs: [],
        errors: [error instanceof Error ? error.message : "Unknown import error"],
        warnings: [],
        stale: 0,
        duplicates: 0,
        message: "Import failed.",
      },
      { status: 400 },
    );
  }
}
