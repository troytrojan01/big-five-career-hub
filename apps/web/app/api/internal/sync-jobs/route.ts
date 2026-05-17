import type { NextRequest } from "next/server";

import type { CompanySlug } from "@bigfive/content";

import { getSyncHealthSnapshot, syncJobs } from "@/lib/job-sync/sync-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const validCompanies = new Set<CompanySlug>(["amazon", "apple", "google", "meta", "microsoft"]);

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function parseCompanies(request: NextRequest) {
  const company = request.nextUrl.searchParams.getAll("company");

  if (!company.length) {
    return null;
  }

  const filtered = company.filter((value): value is CompanySlug => validCompanies.has(value as CompanySlug));
  return filtered.length ? filtered : null;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companies = parseCompanies(request);
  const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";

  if (dryRun) {
    const snapshot = await getSyncHealthSnapshot(companies ?? undefined);
    return Response.json({ ok: true, dryRun: true, snapshot });
  }

  const outcome = await syncJobs(companies ?? undefined);
  return Response.json({ ok: true, ...outcome });
}
