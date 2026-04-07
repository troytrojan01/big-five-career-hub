import { curatedJobs, getAllCompanyHubs, getAllGuides } from "@bigfive/content";

import { getApplyLinkQuality, getJobStatus } from "../apps/web/lib/jobs";

const failures: string[] = [];
const warnings: string[] = [];

for (const job of curatedJobs) {
  if (getJobStatus(job) !== "active") {
    failures.push(`${job.slug}: role is marked inactive.`);
  }

  const applyLinkQuality = getApplyLinkQuality(job);

  if (applyLinkQuality.kind !== "exact") {
    warnings.push(`${job.slug}: ${applyLinkQuality.description}`);
  }
}

for (const company of getAllCompanyHubs()) {
  if (!company.sourceLinks.length) {
    failures.push(`${company.slug}: company hub has no source links.`);
  }
}

for (const guide of getAllGuides()) {
  if (!guide.sourceLinks.length) {
    failures.push(`${guide.slug}: guide has no source links.`);
  }
}

console.log(`Checked ${curatedJobs.length} jobs, ${getAllCompanyHubs().length} company hubs, and ${getAllGuides().length} guides.`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (failures.length) {
  console.error("\nLaunch blockers:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("\nContent readiness checks passed.");
