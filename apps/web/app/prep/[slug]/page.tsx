import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getGuideBySlug } from "@bigfive/content";

import { Chip } from "@/components/chip";
import { renderMdx } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/utils";

export async function generateStaticParams() {
  return [
    "amazon-software-engineering",
    "amazon-product-management",
    "amazon-data-ml",
    "amazon-design-ux",
    "amazon-tpm-program-management",
    "apple-software-engineering",
    "apple-product-management",
    "apple-data-ml",
    "apple-design-ux",
    "apple-tpm-program-management",
    "google-software-engineering",
    "google-product-management",
    "google-data-ml",
    "google-design-ux",
    "google-tpm-program-management",
    "meta-software-engineering",
    "meta-product-management",
    "meta-data-ml",
    "meta-design-ux",
    "meta-tpm-program-management",
    "microsoft-software-engineering",
    "microsoft-product-management",
    "microsoft-data-ml",
    "microsoft-design-ux",
    "microsoft-tpm-program-management",
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: `${guide.company} interview prep for ${guide.roleFamily}.`,
    alternates: {
      canonical: absoluteUrl(`/prep/${guide.slug}`),
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const { content } = await renderMdx(guide.body);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: `${guide.company} interview prep guide for ${guide.roleFamily}`,
    url: absoluteUrl(`/prep/${guide.slug}`),
    author: {
      "@type": "Organization",
      name: "Big Five Career Hub",
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="rounded-4xl border border-ink/10 bg-white p-8 shadow-float">
        <div className="flex flex-wrap gap-2">
          <Chip>{guide.company}</Chip>
          <Chip>{guide.roleFamily}</Chip>
          <Chip>{guide.readTime}</Chip>
        </div>
        <h1 className="mt-6 font-serif text-5xl text-ink">{guide.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate">
          Use this guide to focus your prep on the signals that matter most for this company and role family.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {guide.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
        <div className="prose prose-lg mt-8 max-w-none prose-headings:font-serif prose-p:text-slate">
          {content}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {guide.sourceLinks.map((link) => (
            <a
              key={link}
              href={link}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink/10 bg-sand px-4 py-2 text-sm font-medium text-ink"
            >
              Official reference
            </a>
          ))}
        </div>
      </article>
    </div>
  );
}
