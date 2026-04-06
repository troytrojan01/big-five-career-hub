import Link from "next/link";

import type { GuideFrontmatter } from "@bigfive/content";

import { Chip } from "@/components/chip";

export function GuideCard({ guide }: { guide: GuideFrontmatter }) {
  return (
    <Link href={`/prep/${guide.slug}`} className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float transition hover:-translate-y-1">
      <div className="flex flex-wrap gap-2">
        <Chip>{guide.company}</Chip>
        <Chip>{guide.roleFamily}</Chip>
        <Chip>{guide.readTime}</Chip>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-ink">{guide.title}</h3>
      <p className="mt-4 text-sm text-slate">{guide.tags.join(" • ")}</p>
    </Link>
  );
}
