import Link from "next/link";
import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { ImportJobsPanel } from "@/components/import-jobs-panel";

export const metadata: Metadata = {
  title: "Admin job import",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminImportPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Admin"
        title="Internal import flow for curated jobs."
        description="No scraping in v1. Use this page to validate CSV or JSON role drops, enforce required fields, and write rows to PostgreSQL when configured."
      />
      <div className="mt-8">
        <Link href="/admin/jobs" className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-medium text-ink">
          Back to job operations
        </Link>
      </div>
      <div className="mt-10">
        <ImportJobsPanel />
      </div>
    </div>
  );
}
