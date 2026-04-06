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
