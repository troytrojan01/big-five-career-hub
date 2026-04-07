"use client";

import { FormEvent, useState, useTransition } from "react";

import type { ImportPreview } from "@/lib/import-jobs";
import { createCsvTemplate, createJsonTemplate } from "@/lib/import-template";

function downloadTemplate(format: "csv" | "json") {
  const content = format === "csv" ? createCsvTemplate() : createJsonTemplate();
  const blob = new Blob([content], {
    type: format === "csv" ? "text/csv" : "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `big-five-jobs-template.${format}`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ImportJobsPanel() {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      setMessage("");
      setPreview(null);

      const response = await fetch("/api/admin/import-jobs", {
        method: "POST",
        body: form,
      });

      const payload = (await response.json()) as ImportPreview & { message: string };
      setMessage(payload.message);
      setPreview(payload);
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={handleSubmit} className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float">
        <h2 className="text-2xl font-semibold text-ink">Import curated roles</h2>
        <p className="mt-3 text-slate">
          Upload CSV or JSON for validation. The API requires `officialApplyUrl` and `lastVerifiedAt`, but older verification timestamps no longer auto-hide roles.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadTemplate("csv")}
            className="rounded-full border border-ink/10 bg-sand px-4 py-2 text-sm font-medium text-ink"
          >
            Download CSV template
          </button>
          <button
            type="button"
            onClick={() => downloadTemplate("json")}
            className="rounded-full border border-ink/10 bg-sand px-4 py-2 text-sm font-medium text-ink"
          >
            Download JSON template
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Format
            <select name="format" className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm">
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            File
            <input
              required
              type="file"
              name="file"
              accept=".csv,.json,application/json,text/csv"
              className="rounded-2xl border border-dashed border-ink/20 bg-sand px-4 py-6 text-sm"
            />
          </label>
          <label className="inline-flex items-center gap-3 text-sm text-slate">
            <input type="checkbox" name="commit" value="true" className="h-4 w-4 rounded border-ink/20" />
            Persist rows to PostgreSQL when `DATABASE_URL` is configured
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-6 py-3 font-medium text-sand transition hover:bg-ink/85 disabled:opacity-70"
          >
            {pending ? "Validating..." : "Preview import"}
          </button>
          {message ? <p className="text-sm text-slate">{message}</p> : null}
        </div>
      </form>

      <div className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float">
        <h3 className="text-xl font-semibold text-ink">Preview</h3>
        {!preview ? (
          <p className="mt-4 text-sm leading-7 text-slate">
            The preview shows totals, validation errors, and normalized slugs before any rows are written.
          </p>
        ) : (
          <div className="mt-4 space-y-4 text-sm text-slate">
            <p>Total rows: {preview.total}</p>
            <p>Valid rows: {preview.valid}</p>
            <p>Invalid rows: {preview.invalid}</p>
            <p>Inactive rows: {preview.inactive}</p>
            <p>Duplicate rows: {preview.duplicates}</p>
            <p>Inserted rows: {preview.inserted}</p>
            {preview.warnings.length ? (
              <div>
                <p className="font-medium text-ink">Warnings</p>
                <ul className="mt-2 space-y-2">
                  {preview.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {preview.errors.length ? (
              <div>
                <p className="font-medium text-ink">Errors</p>
                <ul className="mt-2 space-y-2">
                  {preview.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {preview.jobs.length ? (
              <div>
                <p className="font-medium text-ink">Normalized jobs</p>
                <ul className="mt-2 space-y-2">
                  {preview.jobs.slice(0, 5).map((job) => (
                    <li key={`${job.externalJobId}-${job.slug}`}>
                      {job.title} · {job.sourceCompany} · {job.slug}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
