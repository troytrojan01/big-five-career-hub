import { describe, expect, it } from "vitest";

import { parseImportText } from "./import-jobs";

describe("job import parser", () => {
  it("parses csv rows and generates slugs", () => {
    const result = parseImportText(
      `sourceCompany,externalJobId,title,roleFamily,level,location,workMode,team,shortSummary,officialApplyUrl,postedAt,lastVerifiedAt,status
amazon,AMZ-55,Software Engineer,Software Engineering,Mid,Seattle WA,hybrid,Prime Video,Build backend services,https://www.amazon.jobs/,2026-04-01T00:00:00.000Z,2026-04-06T00:00:00.000Z,active`,
      "csv",
    );

    expect(result.valid).toBe(1);
    expect(result.jobs[0]?.slug).toContain("amazon-software-engineer-prime-video");
  });

  it("parses csv boolean values without treating false as true", () => {
    const result = parseImportText(
      `sourceCompany,externalJobId,title,roleFamily,level,location,workMode,team,shortSummary,officialApplyUrl,postedAt,lastVerifiedAt,status,isFeatured
amazon,AMZ-56,Software Engineer,Software Engineering,Mid,Seattle WA,hybrid,Prime Video,Build backend services,https://www.amazon.jobs/,2026-04-01T00:00:00.000Z,2026-04-06T00:00:00.000Z,active,false`,
      "csv",
    );

    expect(result.jobs[0]?.isFeatured).toBe(false);
  });

  it("reports duplicate imported job keys", () => {
    const result = parseImportText(
      JSON.stringify([
        {
          sourceCompany: "google",
          externalJobId: "GOO-1",
          title: "Software Engineer",
          roleFamily: "Software Engineering",
          level: "Mid",
          location: "New York, NY",
          workMode: "hybrid",
          team: "Search",
          shortSummary: "Build useful systems",
          officialApplyUrl: "https://www.google.com/about/careers/applications/jobs/results/",
          postedAt: "2026-04-06T00:00:00.000Z",
          lastVerifiedAt: "2026-04-06T00:00:00.000Z",
          status: "active",
        },
        {
          sourceCompany: "google",
          externalJobId: "GOO-1",
          title: "Software Engineer",
          roleFamily: "Software Engineering",
          level: "Mid",
          location: "New York, NY",
          workMode: "hybrid",
          team: "Search",
          shortSummary: "Build useful systems",
          officialApplyUrl: "https://www.google.com/about/careers/applications/jobs/results/",
          postedAt: "2026-04-06T00:00:00.000Z",
          lastVerifiedAt: "2026-04-06T00:00:00.000Z",
          status: "active",
        },
      ]),
      "json",
    );

    expect(result.duplicates).toBe(1);
    expect(result.invalid).toBe(1);
  });

  it("warns when the apply URL is not an official company domain", () => {
    const result = parseImportText(
      `sourceCompany,externalJobId,title,roleFamily,level,location,workMode,team,shortSummary,officialApplyUrl,postedAt,lastVerifiedAt,status
meta,MET-55,Product Manager,Product Management,Senior,New York NY,hybrid,Creator Tools,Drive roadmap,https://example.com/jobs,2026-04-06T00:00:00.000Z,2026-04-06T00:00:00.000Z,active`,
      "csv",
    );

    expect(result.warnings[0]).toContain("does not match expected meta career domains");
  });

  it("reports invalid rows", () => {
    const result = parseImportText(
      JSON.stringify([
        {
          sourceCompany: "google",
          externalJobId: "",
        },
      ]),
      "json",
    );

    expect(result.invalid).toBe(1);
    expect(result.errors[0]).toContain("Row 1");
  });
});
