import { describe, expect, it } from "vitest";

import { curatedJobs, getAllGuides } from "@bigfive/content";

import { filterGuides, getGuideJobs, getRelatedGuides } from "./guides";

describe("guide filters", () => {
  const guides = getAllGuides();

  it("filters by company and role family", () => {
    const results = filterGuides(guides, {
      company: "google",
      roleFamily: "Software Engineering",
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.slug).toBe("google-software-engineering");
  });

  it("filters by keyword across tags and titles", () => {
    const results = filterGuides(guides, {
      search: "customer-focus",
    });

    expect(results.some((guide) => guide.slug === "microsoft-product-management")).toBe(true);
  });

  it("finds related guides by shared company or role family", () => {
    const target = guides.find((guide) => guide.slug === "meta-product-management")!;
    const results = getRelatedGuides(guides, target);

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((guide) => guide.company === "meta" || guide.roleFamily === "Product Management")).toBe(true);
  });

  it("finds matching jobs for a guide", () => {
    const target = guides.find((guide) => guide.slug === "microsoft-tpm-program-management")!;
    const results = getGuideJobs(curatedJobs, target);

    expect(results[0]?.slug).toBe("microsoft-principal-tpm-azure-ai-platform");
  });
});
