import { describe, expect, it } from "vitest";

import { curatedJobs } from "@bigfive/content";

import {
  filterJobs,
  getActiveJobs,
  getApplyLinkQuality,
  getJobStatus,
  isJobPostedWithin,
} from "./jobs";

describe("job freshness", () => {
  it("lets candidates filter by posted-date freshness", () => {
    expect(isJobPostedWithin("2026-04-03T08:00:00.000Z", "7", new Date("2026-04-06T12:00:00.000Z"))).toBe(true);
    expect(isJobPostedWithin("2026-03-03T08:00:00.000Z", "7", new Date("2026-04-06T12:00:00.000Z"))).toBe(false);
  });

  it("keeps active jobs visible even when verification is older", () => {
    const job = curatedJobs[0];
    const results = filterJobs(
      [
        {
          ...job,
          postedAt: "2026-03-01T00:00:00.000Z",
          lastVerifiedAt: "2026-03-01T00:00:00.000Z",
          status: "active",
        },
      ],
      {},
      new Date("2026-04-06T12:00:00.000Z"),
    );

    expect(getJobStatus(results[0]!)).toBe("active");
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

  it("defaults to newest posted listings first", () => {
    const results = filterJobs(curatedJobs, {}, new Date("2026-04-06T12:00:00.000Z"));

    expect(new Date(results[0]!.postedAt).getTime()).toBeGreaterThanOrEqual(new Date(results[1]!.postedAt).getTime());
  });

  it("returns active jobs newest first for latest role surfaces", () => {
    const [olderActive, inactive, newerActive] = curatedJobs.slice(0, 3).map((job, index) => ({
      ...job,
      postedAt: ["2026-04-01T00:00:00.000Z", "2026-04-03T00:00:00.000Z", "2026-04-05T00:00:00.000Z"][
        index
      ]!,
      status: index === 1 ? "inactive" as const : "active" as const,
    }));

    const results = getActiveJobs([olderActive!, inactive!, newerActive!]);

    expect(results.map((job) => job.status)).toEqual(["active", "active"]);
    expect(results.map((job) => job.postedAt)).toEqual([
      "2026-04-05T00:00:00.000Z",
      "2026-04-01T00:00:00.000Z",
    ]);
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

  it("labels official detail links as exact when the URL contains the source id without its company prefix", () => {
    expect(
      getApplyLinkQuality({
        ...curatedJobs[0]!,
        externalJobId: "APL-200656154-0157",
        officialApplyUrl:
          "https://jobs.apple.com/en-us/details/200656154-0157/data-center-mlb-reliability-engineer?team=HRDWR",
      }).kind,
    ).toBe("exact");
  });
});
