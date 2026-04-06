import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

import type { CompanyFrontmatter, GuideFrontmatter } from "./types";

const CONTENT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../content");

function readDirectory<T>(directory: string) {
  const fullPath = path.join(CONTENT_ROOT, directory);
  const entries = fs.readdirSync(fullPath);

  return entries.map((entry) => {
    const filePath = path.join(fullPath, entry);
    const raw = fs.readFileSync(filePath, "utf8");
    const { content, data } = matter(raw);

    return {
      body: content,
      filePath,
      ...data,
    } as T & { body: string; filePath: string };
  });
}

export function getAllCompanyHubs() {
  return readDirectory<CompanyFrontmatter>("companies").sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

export function getCompanyHubBySlug(slug: string) {
  return getAllCompanyHubs().find((company) => company.slug === slug);
}

export function getAllGuides() {
  return readDirectory<GuideFrontmatter>("guides").sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

export function getGuideBySlug(slug: string) {
  return getAllGuides().find((guide) => guide.slug === slug);
}
