import type { Metadata } from "next";

import { companies, getAllGuides, resources } from "@bigfive/content";

import { CompanyPrepCard } from "@/components/company-prep-card";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Interview Prep",
  description: "Official hiring and interview prep resources organized by Big Tech company.",
};

export default function PrepPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Interview prep"
        title="Company prep libraries with official hiring material first."
        description="Each card collects the employer's own interview, hiring, and candidate resources. Our editorial notes stay secondary, so role-specific promises only appear when the source material supports them."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <CompanyPrepCard key={company.slug} company={company} guides={guides} resources={resources} />
        ))}
      </div>
    </div>
  );
}
