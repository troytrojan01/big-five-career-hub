import slugify from "slugify";

import type { JobListing } from "@bigfive/content";

import { buildJobListing, decodeHtmlEntities, dedupeJobs, normalizeWorkMode, stripHtml } from "./normalize";
import { fetchJson, fetchText, mapWithConcurrency } from "./fetch";
import type { JobSyncAdapter } from "./types";

type AmazonSearchResponse = {
  jobs: Array<{
    id_icims: string;
    title: string;
    team: unknown;
    job_family: string | null;
    job_category: string | null;
    company_name: string | null;
    description_short: string | null;
    description: string | null;
    job_path: string;
    location: string;
    normalized_location: string | null;
    posted_date: string;
    locations?: string[];
  }>;
};

type MicrosoftSearchResponse = {
  data: {
    positions: Array<{
      id: number;
      displayJobId: string;
      atsJobId: string;
      name: string;
      locations: string[];
      standardizedLocations: string[];
      postedTs: number;
      department: string | null;
      workLocationOption: string | null;
      locationFlexibility: string | null;
      positionUrl: string;
    }>;
  };
};

const AMAZON_BASE_URL = "https://www.amazon.jobs";
const APPLE_BASE_URL = "https://jobs.apple.com";
const GOOGLE_BASE_URL = "https://www.google.com/about/careers/applications/";
const MICROSOFT_BASE_URL = "https://apply.careers.microsoft.com";
const META_BASE_URL = "https://www.metacareers.com";

function isUnitedStatesLocation(value: string) {
  const normalized = value.toLowerCase();

  return (
    normalized.includes("united states") ||
    normalized.includes(", us") ||
    normalized === "us" ||
    normalized.includes("usa")
  );
}

function extractTextMatches(block: string, pattern: RegExp) {
  return [...block.matchAll(pattern)].map((match) => decodeHtmlEntities(stripHtml(match[1] ?? "")));
}

function normalizeGoogleLocation(value: string) {
  return value
    .replace(/^;+\s*/, "")
    .replace(/\s*;+\s*/g, "; ")
    .trim();
}

function parseAmazonWorkMode(locations?: string[]) {
  if (!locations?.length) {
    return normalizeWorkMode();
  }

  for (const location of locations) {
    try {
      const parsed = JSON.parse(location) as { type?: string };
      if (parsed.type) {
        return normalizeWorkMode(parsed.type);
      }
    } catch {
      continue;
    }
  }

  return normalizeWorkMode();
}

function parseAmazonTeam(team: unknown) {
  const normalize = (value: string) =>
    value
      .replace(/^team-/, "")
      .replace(/-/g, " ")
      .trim();

  if (typeof team === "string") {
    return normalize(team);
  }

  if (team && typeof team === "object") {
    const record = team as Record<string, unknown>;
    return normalize(String(record.title ?? record.label ?? record.name ?? ""));
  }

  return "";
}

function isAmazonUnitedStatesJob(job: AmazonSearchResponse["jobs"][number]) {
  if (job.location.startsWith("US,") || job.location.includes("United States")) {
    return true;
  }

  if (!job.locations?.length) {
    return false;
  }

  return job.locations.some((location) => {
    try {
      const parsed = JSON.parse(location) as {
        normalizedCountryCode?: string;
        countryIso2a?: string;
        normalizedCountryName?: string;
      };

      return (
        parsed.normalizedCountryCode === "USA" ||
        parsed.countryIso2a === "US" ||
        parsed.normalizedCountryName === "United States"
      );
    } catch {
      return false;
    }
  });
}

async function fetchAmazonJobs() {
  const queries = [
    "",
    "cloud solution architect",
    "solution architect",
    "solutions architect",
    "solutions engineer",
    "security engineer",
    "security consultant",
  ];
  const pages = [0, 20];
  const jobs = await Promise.all(
    queries.flatMap((query) =>
      pages.map(async (offset) => {
        const url = new URL("/en/search.json", AMAZON_BASE_URL);
        url.searchParams.set("loc_query", "United States");
        url.searchParams.set("result_limit", "20");
        url.searchParams.set("offset", String(offset));

        if (query) {
          url.searchParams.set("base_query", query);
        }

        const data = await fetchJson<AmazonSearchResponse>(url.toString());

        return data.jobs
          .filter((job) => isAmazonUnitedStatesJob(job))
          .map((job) =>
            buildJobListing({
              sourceCompany: "amazon",
              externalJobId: job.id_icims,
              title: job.title,
              team: parseAmazonTeam(job.team) || job.job_family || job.company_name || "Amazon",
              location: job.normalized_location ?? job.location,
              workMode: parseAmazonWorkMode(job.locations),
              shortSummary: job.description_short ?? job.description ?? `${job.title} at Amazon.`,
              officialApplyUrl: new URL(job.job_path, AMAZON_BASE_URL).toString(),
              postedAt: job.posted_date,
              roleFamilyHint: job.job_family ?? job.job_category,
            }),
          )
          .filter((job): job is JobListing => Boolean(job));
      }),
    ),
  );

  return dedupeJobs(jobs.flat());
}

function parseAppleCards(html: string) {
  const cardPattern =
    /<h3><a[^>]+href="([^"]*\/details\/([^/]+)\/[^"]+)"[^>]*>([^<]+)<\/a><\/h3><span[^>]*class="team-name[^"]*"[^>]*>([^<]+)<\/span><span[^>]*class="job-posted-date[^"]*"[^>]*>([^<]+)<\/span>[\s\S]*?<span[^>]*class="table--advanced-search__location-sub[^"]*"[^>]*>([^<]+)<\/span>/g;

  return [...html.matchAll(cardPattern)].map((match) => ({
    href: match[1],
    id: match[2],
    title: decodeHtmlEntities(stripHtml(match[3] ?? "")),
    team: decodeHtmlEntities(stripHtml(match[4] ?? "")),
    postedAt: decodeHtmlEntities(stripHtml(match[5] ?? "")),
    location: decodeHtmlEntities(stripHtml(match[6] ?? "")),
  }));
}

async function fetchAppleJobs() {
  const queries = [
    "software",
    "product manager",
    "machine learning",
    "designer",
    "program manager",
    "solution architect",
    "solutions architect",
    "solutions engineer",
    "security engineer",
    "security consultant",
  ];
  const htmlPages = await Promise.all(
    queries.flatMap((query) =>
      [1, 2].map((page) =>
        fetchText(
          `${APPLE_BASE_URL}/en-us/search?location=united-states-USA&search=${encodeURIComponent(query)}&page=${page}`,
        ),
      ),
    ),
  );

  const jobs = htmlPages
    .flatMap((html) => parseAppleCards(html))
    .map((job) =>
      buildJobListing({
        sourceCompany: "apple",
        externalJobId: job.id,
        title: job.title,
        team: job.team,
        location: job.location,
        workMode: normalizeWorkMode(job.location),
        shortSummary: `${job.title} on the ${job.team} team at Apple.`,
        officialApplyUrl: new URL(job.href, APPLE_BASE_URL).toString(),
        postedAt: job.postedAt,
        roleFamilyHint: job.team,
      }),
    )
    .filter((job): job is JobListing => Boolean(job));

  return dedupeJobs(jobs);
}

type GoogleListingCard = {
  id: string;
  title: string;
  company: string;
  location: string;
  level: string;
};

function parseGoogleListingCards(html: string) {
  const blocks = [...html.matchAll(/<li class="lLd3Je" ssk='[^']*'><div[\s\S]*?<\/li>/g)].map((match) => match[0]);

  return blocks
    .map((block) => {
      const id = block.match(/ssk='[^:]+:(\d+)'/)?.[1] ?? "";
      const titleMatch = block.match(/<h3 class="QJPWVe">([\s\S]*?)<\/h3>/);
      const companyMatch = block.match(/<span class="RP7SMd">[\s\S]*?<span>([^<]+)<\/span>/);
      const locationMatches = extractTextMatches(block, /<span class="r0wTof[^"]*">([^<]+)<\/span>/g);
      const levelMatch = block.match(/<span class="wVSTAb">([^<]+)<\/span>/);

      if (!id || !titleMatch || !companyMatch || !locationMatches.length) {
        return null;
      }

      return {
        id,
        title: decodeHtmlEntities(stripHtml(titleMatch[1])),
        company: decodeHtmlEntities(stripHtml(companyMatch[1])),
        location: [...new Set(locationMatches.map(normalizeGoogleLocation).filter(Boolean))].join("; "),
        level: decodeHtmlEntities(stripHtml(levelMatch?.[1] ?? "")),
      } satisfies GoogleListingCard;
    })
    .filter((card): card is GoogleListingCard => Boolean(card));
}

function parseGoogleDetail(detailHtml: string) {
  const aboutMatch = detailHtml.match(/<div class="aG5W3"><h3>About the job<\/h3>([\s\S]*?)<\/div><div class="BDNOWe">/);
  const qualificationsMatch = detailHtml.match(
    /<h3>Minimum qualifications:<\/h3>[\s\S]*?<\/ul>(?:<br><h3>Preferred qualifications:<\/h3>[\s\S]*?<\/ul>)?/,
  );
  const timestampMatch = detailHtml.match(/\[2\],\[(\d{10}),\d+\],\[(\d{10}),\d+\],\[(\d{10}),\d+\],\[null,/);

  return {
    about: stripHtml(aboutMatch?.[1] ?? ""),
    qualifications: stripHtml(qualificationsMatch?.[0] ?? ""),
    postedAt: timestampMatch ? new Date(Number(timestampMatch[1]) * 1000).toISOString() : new Date().toISOString(),
  };
}

async function fetchGoogleJobs() {
  const queryPages = [
    "cloud solution architect",
    "solution architect",
    "solutions engineer",
    "security engineer",
    "security consultant",
  ];
  const listingPages = await Promise.all(
    [
      ...[1, 2].map((page) =>
        new URL(`jobs/results/?location=United%20States&sort_by=date&page=${page}`, GOOGLE_BASE_URL).toString(),
      ),
      ...queryPages.map((query) => {
        const url = new URL("jobs/results/", GOOGLE_BASE_URL);
        url.searchParams.set("location", "United States");
        url.searchParams.set("sort_by", "date");
        url.searchParams.set("q", query);
        return url.toString();
      }),
    ].map((url) => fetchText(url)),
  );

  const listingCards = dedupeJobs(
    (
      await mapWithConcurrency(
        listingPages.flatMap((html) => parseGoogleListingCards(html)),
        6,
        async (card) => {
          const detailUrl = new URL(
            `jobs/results/${card.id}-${slugify(card.title, { lower: true, strict: true, trim: true })}`,
            GOOGLE_BASE_URL,
          ).toString();
          const detailHtml = await fetchText(detailUrl);
          const detail = parseGoogleDetail(detailHtml);

          return buildJobListing({
            sourceCompany: "google",
            externalJobId: card.id,
            title: card.title,
            team: card.company,
            location: card.location,
            workMode: normalizeWorkMode(card.location),
            shortSummary: detail.about || detail.qualifications || `${card.title} at ${card.company}.`,
            officialApplyUrl: detailUrl,
            postedAt: detail.postedAt,
            levelHint: card.level,
            roleFamilyHint: `${card.company} ${card.level}`,
          });
        },
      )
    ).filter((job): job is JobListing => Boolean(job)),
  );

  return listingCards;
}

async function fetchMicrosoftJobs() {
  const queries = [
    "software",
    "product manager",
    "technical program manager",
    "machine learning",
    "designer",
    "cloud solution architect",
    "solution architect",
    "solutions architect",
    "solutions engineer",
    "security engineer",
    "security consultant",
  ];

  const results = await Promise.all(
    queries.map(async (query) => {
      const url = `${MICROSOFT_BASE_URL}/api/pcsx/search?domain=microsoft.com&query=${encodeURIComponent(query)}`;
      const data = await fetchJson<MicrosoftSearchResponse>(url);

      return data.data.positions
        .map((position) =>
          buildJobListing({
            sourceCompany: "microsoft",
            externalJobId: position.atsJobId || position.displayJobId || String(position.id),
            title: position.name,
            team: position.department ?? "Microsoft",
            location:
              position.standardizedLocations.join("; ") ||
              position.locations.join("; ") ||
              "United States",
            workMode: normalizeWorkMode(
              position.workLocationOption ?? position.locationFlexibility ?? position.locations.join(" "),
            ),
            shortSummary: `${position.name} in ${position.department ?? "a Microsoft team"} at Microsoft.`,
            officialApplyUrl: `${MICROSOFT_BASE_URL}${position.positionUrl}?domain=microsoft.com`,
            postedAt: new Date(position.postedTs * 1000).toISOString(),
            roleFamilyHint: position.department,
          }),
        )
        .filter((job): job is JobListing => Boolean(job))
        .filter((job) => isUnitedStatesLocation(job.location));
    }),
  );

  return dedupeJobs(results.flat());
}

function parseMetaJsonLd(html: string) {
  const match = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);

  if (!match?.[1]) {
    return null;
  }

  return JSON.parse(match[1]) as {
    title?: string;
    description?: string;
    responsibilities?: string;
    qualifications?: string;
    datePosted?: string;
    jobLocation?: Array<{ name?: string }> | { name?: string };
  };
}

function normalizeMetaLocations(jobLocation: Array<{ name?: string }> | { name?: string } | undefined) {
  const locations = Array.isArray(jobLocation) ? jobLocation : jobLocation ? [jobLocation] : [];
  return locations.map((location) => stripHtml(location.name ?? "")).filter(Boolean);
}

async function fetchMetaJobs() {
  const sitemap = await fetchText(`${META_BASE_URL}/jobsearch/sitemap.xml`);
  const detailUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).slice(0, 60);

  const jobs = (
    await mapWithConcurrency(detailUrls, 6, async (detailUrl) => {
      const html = await fetchText(detailUrl);
      const jsonLd = parseMetaJsonLd(html);

      if (!jsonLd?.title || !jsonLd.datePosted) {
        return null;
      }

      const locations = normalizeMetaLocations(jsonLd.jobLocation);

      if (!locations.some((location) => isUnitedStatesLocation(location))) {
        return null;
      }

      return buildJobListing({
        sourceCompany: "meta",
        externalJobId: detailUrl.split("/").filter(Boolean).at(-1) ?? detailUrl,
        title: jsonLd.title,
        team: "Meta Careers",
        location: locations.join("; "),
        workMode: normalizeWorkMode(locations.join(" ")),
        shortSummary: jsonLd.description ?? jsonLd.responsibilities ?? jsonLd.qualifications ?? jsonLd.title,
        officialApplyUrl: detailUrl,
        postedAt: jsonLd.datePosted,
        roleFamilyHint: jsonLd.qualifications ?? jsonLd.description,
      });
    })
  ).filter((job): job is JobListing => Boolean(job));

  return dedupeJobs(jobs).slice(0, 20);
}

export const jobSyncAdapters: JobSyncAdapter[] = [
  {
    company: "amazon",
    deactivateMissing: true,
    fetchJobs: fetchAmazonJobs,
  },
  {
    company: "apple",
    fetchJobs: fetchAppleJobs,
  },
  {
    company: "google",
    deactivateMissing: true,
    fetchJobs: fetchGoogleJobs,
  },
  {
    company: "meta",
    fetchJobs: fetchMetaJobs,
  },
  {
    company: "microsoft",
    deactivateMissing: true,
    fetchJobs: fetchMicrosoftJobs,
  },
];
