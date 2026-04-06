import type { Metadata } from "next";

import { getAllGuides, roleFamilies } from "@bigfive/content";

import { GuideCard } from "@/components/guide-card";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Interview Prep",
  description: "Company-specific Big Tech interview prep guides across five role families.",
};

export default function PrepPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Interview prep"
        title="Twenty-five launch guides across the highest-intent role families."
        description="Each guide is tied to one of the five companies and one of the five launch role families so users can prepare with more context than a generic interview checklist."
      />

      <div className="mt-10 flex flex-wrap gap-2">
        {roleFamilies.map((roleFamily) => (
          <span key={roleFamily} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-slate">
            {roleFamily}
          </span>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </div>
  );
}
