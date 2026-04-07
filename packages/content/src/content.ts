import { embeddedCompanyHubs, embeddedGuides } from "./generated-content";

export function getAllCompanyHubs() {
  return [...embeddedCompanyHubs].sort((a, b) => a.title.localeCompare(b.title));
}

export function getCompanyHubBySlug(slug: string) {
  return getAllCompanyHubs().find((company) => company.slug === slug);
}

export function getAllGuides() {
  return [...embeddedGuides].sort((a, b) => a.title.localeCompare(b.title));
}

export function getGuideBySlug(slug: string) {
  return getAllGuides().find((guide) => guide.slug === slug);
}
