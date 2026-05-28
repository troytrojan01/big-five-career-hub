import { describe, expect, it } from "vitest";

import { buildJobListing, deriveLevel, deriveRoleFamily, normalizeLocation, normalizeWorkMode } from "./normalize";

describe("job sync normalization", () => {
  it("maps target role families from titles", () => {
    expect(deriveRoleFamily("Senior Software Engineer")).toBe("Software Engineering");
    expect(deriveRoleFamily("Product Manager")).toBe("Product Management");
    expect(deriveRoleFamily("Machine Learning Research Scientist")).toBe("Data / ML");
    expect(deriveRoleFamily("Senior Product Designer")).toBe("Design / UX");
    expect(deriveRoleFamily("Technical Program Manager")).toBe("TPM / Program Management");
    expect(deriveRoleFamily("Cloud Solution Architect (CSA)")).toBe("Solutions & Security");
    expect(deriveRoleFamily("Senior Solutions Engineer")).toBe("Solutions & Security");
    expect(deriveRoleFamily("Security Engineer")).toBe("Solutions & Security");
    expect(deriveRoleFamily("Security Consultant")).toBe("Solutions & Security");
  });

  it("maps levels from title hints", () => {
    expect(deriveLevel("Principal Engineer")).toBe("Lead");
    expect(deriveLevel("Senior Software Engineer")).toBe("Senior");
    expect(deriveLevel("Software Engineer II")).toBe("Mid");
    expect(deriveLevel("Associate Product Manager")).toBe("Entry");
    expect(deriveLevel("Software Engineering Intern")).toBe("Intern");
  });

  it("normalizes work modes", () => {
    expect(normalizeWorkMode("Remote")).toBe("remote");
    expect(normalizeWorkMode("Hybrid")).toBe("hybrid");
    expect(normalizeWorkMode("Onsite")).toBe("onsite");
  });

  it("cleans leading separators from multi-location strings", () => {
    expect(normalizeLocation("; Atlanta, GA, USA; Sunnyvale, CA, USA")).toBe("Atlanta, GA, USA; Sunnyvale, CA, USA");
  });

  it("keeps generated slugs within the database limit", () => {
    const job = buildJobListing({
      sourceCompany: "microsoft",
      externalJobId: "200036777",
      title: "Principal Technical Program Manager ".repeat(8),
      team: "Azure Core Infrastructure and Advanced Systems ".repeat(5),
      location: "Redmond, WA",
      shortSummary: "Lead complex cross-functional programs.",
      officialApplyUrl: "https://apply.careers.microsoft.com/careers/job/200036777?domain=microsoft.com",
      postedAt: "2026-05-16T00:00:00.000Z",
    });

    expect(job?.slug.length).toBeLessThanOrEqual(180);
    expect(job?.slug.endsWith("200036777")).toBe(true);
  });

  it("drops non-target roles", () => {
    const job = buildJobListing({
      sourceCompany: "amazon",
      externalJobId: "123",
      title: "Marketing Manager",
      team: "Marketing",
      location: "Seattle, WA",
      shortSummary: "Lead lifecycle campaigns.",
      officialApplyUrl: "https://www.amazon.jobs/en/jobs/123/marketing-manager",
      postedAt: "2026-05-16T00:00:00.000Z",
    });

    expect(job).toBeNull();
  });

  it("keeps solutions and security roles in the job import set", () => {
    const job = buildJobListing({
      sourceCompany: "microsoft",
      externalJobId: "CSA-123",
      title: "Cloud Solution Architect",
      team: "Customer Success",
      location: "United States",
      shortSummary: "Help customers design and secure cloud solutions.",
      officialApplyUrl: "https://apply.careers.microsoft.com/careers/job/CSA-123?domain=microsoft.com",
      postedAt: "2026-05-16T00:00:00.000Z",
    });

    expect(job?.roleFamily).toBe("Solutions & Security");
  });
});
