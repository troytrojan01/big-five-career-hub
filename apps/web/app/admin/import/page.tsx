import { SectionHeading } from "@/components/section-heading";
import { ImportJobsPanel } from "@/components/import-jobs-panel";

export default function AdminImportPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Admin"
        title="Internal import flow for curated jobs."
        description="No scraping in v1. Use this page to validate CSV or JSON role drops, enforce required fields, and write rows to PostgreSQL when configured."
      />
      <div className="mt-10">
        <ImportJobsPanel />
      </div>
    </div>
  );
}
