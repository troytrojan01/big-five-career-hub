import { describe, expect, it } from "vitest";

import { curatedJobs } from "@bigfive/content";

import { filterJobs, getApplyLinkQuality, getJobStatus, isJobFresh } from "./jobs";

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

  it("filters by exact team and location", () => {
    const results = filterJobs(
      curatedJobs,
      {
        team: "Azure AI Platform",
        location: "Redmond, WA",
      },
      new Date("2026-04-06T12:00:00.000Z"),
    );

    expect(results).toHaveLength(1);
    expect(results[0]?.sourceCompany).toBe("microsoft");
  });

  it("sorts by recently verified when requested", () => {
    const results = filterJobs(curatedJobs, { sort: "verified" }, new Date("2026-04-06T12:00:00.000Z"));

    expect(results[0]?.lastVerifiedAt).toBe("2026-04-06T12:00:00.000Z");
  });
});

describe("apply link quality", () => {
  it("labels generic company careers pages as official search links", () => {
    expect(getApplyLinkQuality(curatedJobs[0]!).kind).toBe("search");
  });

  it("labels links containing the external job id as exact", () => {
    expect(
      getApplyLinkQuality({
        ...curatedJobs[0]!,
        officialApplyUrl: `https://www.amazon.jobs/jobs/${curatedJobs[0]!.externalJobId}`,
      }).kind,
    ).toBe("exact");
  });
});
