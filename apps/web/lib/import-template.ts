export const importJobFields = [
  "sourceCompany",
  "externalJobId",
  "title",
  "roleFamily",
  "level",
  "location",
  "workMode",
  "team",
  "shortSummary",
  "officialApplyUrl",
  "postedAt",
  "lastVerifiedAt",
  "status",
  "isFeatured",
] as const;

export const sampleImportRows = [
  {
    sourceCompany: "amazon",
    externalJobId: "AMZ-SAMPLE-001",
    title: "Software Development Engineer",
    roleFamily: "Software Engineering",
    level: "Mid",
    location: "Seattle, WA",
    workMode: "hybrid",
    team: "Example Platform",
    shortSummary: "Curated sample role with an official apply link and current verification timestamp.",
    officialApplyUrl: "https://www.amazon.jobs/",
    postedAt: "2026-04-06T12:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active",
    isFeatured: false,
  },
];

export function createCsvTemplate() {
  const rows = [
    importJobFields.join(","),
    ...sampleImportRows.map((row) =>
      importJobFields
        .map((field) => {
          const value = String(row[field]);
          return value.includes(",") ? `"${value.replaceAll('"', '""')}"` : value;
        })
        .join(","),
    ),
  ];

  return rows.join("\n");
}

export function createJsonTemplate() {
  return JSON.stringify(sampleImportRows, null, 2);
}
