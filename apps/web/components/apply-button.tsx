"use client";

import { track } from "@/lib/analytics";

export function ApplyButton({
  href,
  company,
  title,
}: {
  href: string;
  company: string;
  title: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-medium text-sand transition hover:bg-ink/85"
      onClick={() => track("job_apply_click", { company, title })}
    >
      Apply on official site
    </a>
  );
}
