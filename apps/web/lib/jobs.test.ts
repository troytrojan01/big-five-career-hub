import { describe, expect, it } from "vitest";

import { curatedJobs } from "@bigfive/content";

import { filterJobs, getJobStatus, isJobFresh } from "./jobs";

describe("job freshness", () => {
  it("marks jobs older than 48 hours as inactive", () => {
    expect(isJobFresh("2026-04-03T08:00:00.000Z", new Date("2026-04-06T12:00:00.000Z"))).toBe(false);
  });

  it("keeps recently verified jobs active", () => {
    const job = curatedJobs[0];
    expect(getJobStatus(job, new Date("2026-04-06T12:00:00.000Z"))).toBe("active");
  });
});

describe("job filters", () => {
  it("filters by company and work mode", () => {
    const results = filterJobs(
      curatedJobs,
      {
        company: "microsoft",
        workMode: "remote",
      },
      new Date("2026-04-06T12:00:00.000Z"),
    );

    expect(results).toHaveLength(1);
    expect(results[0]?.slug).toBe("microsoft-design-manager-m365-copilot");
  });

  it("filters by free text search", () => {
    const results = filterJobs(
      curatedJobs,
      { search: "reels creation" },
      new Date("2026-04-06T12:00:00.000Z"),
    );

    expect(results).toHaveLength(1);
    expect(results[0]?.sourceCompany).toBe("meta");
  });
});
