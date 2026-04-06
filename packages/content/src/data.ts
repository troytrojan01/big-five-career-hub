import type { CompanyRecord, JobListing, ResourceLink } from "./types";

export const companies: CompanyRecord[] = [
  {
    slug: "amazon",
    name: "Amazon",
    careersUrl: "https://www.amazon.jobs/",
    principlesSummary:
      "Customer obsession, ownership, high standards, and speed shape how Amazon evaluates candidates and teams.",
    hiringProcessSummary:
      "Amazon typically combines recruiter screening, role-specific interviews, and behavioral evaluation tied closely to the Leadership Principles.",
    accent: "#ff9900",
  },
  {
    slug: "apple",
    name: "Apple",
    careersUrl: "https://jobs.apple.com/en-us/search",
    principlesSummary:
      "Apple emphasizes craft, cross-functional collaboration, and a high bar for product judgment, communication, and execution.",
    hiringProcessSummary:
      "Apple interview loops often mix functional depth with collaboration signals and product thinking, tailored by team.",
    accent: "#a2aaad",
  },
  {
    slug: "google",
    name: "Google",
    careersUrl: "https://www.google.com/about/careers/applications/jobs/results/",
    principlesSummary:
      "Google looks for role-related knowledge, general cognitive ability, leadership, and Googleyness in a structured hiring process.",
    hiringProcessSummary:
      "Google candidates usually move through recruiter screening, assessments, and panel interviews with calibrated written feedback.",
    accent: "#4285f4",
  },
  {
    slug: "meta",
    name: "Meta",
    careersUrl: "https://www.metacareers.com/jobs/",
    principlesSummary:
      "Meta rewards impact, speed, communication, and the ability to operate through ambiguity at high scope.",
    hiringProcessSummary:
      "Meta interview loops often include recruiter screening, functional rounds, and role-specific execution or case interviews.",
    accent: "#0a66ff",
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    careersUrl: "https://careers.microsoft.com/v2/global/en/home.html",
    principlesSummary:
      "Microsoft centers growth mindset, collaboration, customer value, and inclusive impact across product and platform roles.",
    hiringProcessSummary:
      "Microsoft interviews typically balance functional depth, problem solving, collaboration, and customer orientation.",
    accent: "#7fba00",
  },
];

export const roleFamilies = [
  "Software Engineering",
  "Product Management",
  "Data & ML",
  "Design & UX",
  "TPM / Program Management",
] as const;

export const curatedJobs: JobListing[] = [
  {
    sourceCompany: "amazon",
    externalJobId: "AMZ-10001",
    slug: "amazon-sr-software-engineer-alexa-platform",
    title: "Senior Software Engineer",
    roleFamily: "Software Engineering",
    level: "Senior",
    location: "Seattle, WA",
    workMode: "hybrid",
    team: "Alexa Platform",
    shortSummary:
      "Build backend services and developer tooling for Alexa platform experiences with a strong ownership bar.",
    officialApplyUrl: "https://www.amazon.jobs/",
    postedAt: "2026-04-03T14:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active",
    isFeatured: true,
  },
  {
    sourceCompany: "apple",
    externalJobId: "APL-10002",
    slug: "apple-product-manager-applecare-platform",
    title: "Product Manager",
    roleFamily: "Product Management",
    level: "Mid",
    location: "Austin, TX",
    workMode: "hybrid",
    team: "AppleCare Platform",
    shortSummary:
      "Drive roadmap decisions across internal tooling, service workflows, and cross-functional execution for support products.",
    officialApplyUrl: "https://jobs.apple.com/en-us/search",
    postedAt: "2026-04-01T15:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active",
    isFeatured: true,
  },
  {
    sourceCompany: "google",
    externalJobId: "GOO-10003",
    slug: "google-data-scientist-cloud-growth",
    title: "Data Scientist",
    roleFamily: "Data & ML",
    level: "Mid",
    location: "New York, NY",
    workMode: "hybrid",
    team: "Cloud Growth",
    shortSummary:
      "Partner with product and go-to-market teams to model growth, run experiments, and influence Google Cloud strategy.",
    officialApplyUrl: "https://www.google.com/about/careers/applications/jobs/results/",
    postedAt: "2026-04-02T16:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active",
    isFeatured: true,
  },
  {
    sourceCompany: "meta",
    externalJobId: "MET-10004",
    slug: "meta-product-designer-reels-creation",
    title: "Product Designer",
    roleFamily: "Design & UX",
    level: "Senior",
    location: "Menlo Park, CA",
    workMode: "onsite",
    team: "Reels Creation",
    shortSummary:
      "Lead end-to-end product design for creator workflows with a bias toward execution and strong product intuition.",
    officialApplyUrl: "https://www.metacareers.com/jobs/",
    postedAt: "2026-04-04T16:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active",
    isFeatured: true,
  },
  {
    sourceCompany: "microsoft",
    externalJobId: "MSF-10005",
    slug: "microsoft-principal-tpm-azure-ai-platform",
    title: "Principal Technical Program Manager",
    roleFamily: "TPM / Program Management",
    level: "Principal",
    location: "Redmond, WA",
    workMode: "hybrid",
    team: "Azure AI Platform",
    shortSummary:
      "Coordinate platform delivery, partner alignment, and roadmap execution across Azure AI infrastructure teams.",
    officialApplyUrl: "https://careers.microsoft.com/v2/global/en/search-results",
    postedAt: "2026-04-05T10:30:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active",
    isFeatured: true,
  },
  {
    sourceCompany: "amazon",
    externalJobId: "AMZ-10006",
    slug: "amazon-ml-engineer-prime-video-personalization",
    title: "Machine Learning Engineer",
    roleFamily: "Data & ML",
    level: "Senior",
    location: "New York, NY",
    workMode: "hybrid",
    team: "Prime Video Personalization",
    shortSummary:
      "Improve ranking systems and experimentation velocity for customer-facing personalization experiences.",
    officialApplyUrl: "https://www.amazon.jobs/",
    postedAt: "2026-04-01T11:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active"
  },
  {
    sourceCompany: "apple",
    externalJobId: "APL-10007",
    slug: "apple-ux-researcher-vision-products",
    title: "UX Researcher",
    roleFamily: "Design & UX",
    level: "Senior",
    location: "Cupertino, CA",
    workMode: "onsite",
    team: "Vision Products",
    shortSummary:
      "Shape hardware-software experiences through qualitative and mixed-method studies that drive product decisions.",
    officialApplyUrl: "https://jobs.apple.com/en-us/search",
    postedAt: "2026-03-30T12:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active"
  },
  {
    sourceCompany: "google",
    externalJobId: "GOO-10008",
    slug: "google-software-engineer-youtube-recommendations",
    title: "Software Engineer",
    roleFamily: "Software Engineering",
    level: "Mid",
    location: "Mountain View, CA",
    workMode: "hybrid",
    team: "YouTube Recommendations",
    shortSummary:
      "Build recommendation systems and distributed services that improve discovery and creator outcomes.",
    officialApplyUrl: "https://www.google.com/about/careers/applications/jobs/results/",
    postedAt: "2026-04-05T09:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active"
  },
  {
    sourceCompany: "meta",
    externalJobId: "MET-10009",
    slug: "meta-product-manager-whatsapp-business-growth",
    title: "Product Manager",
    roleFamily: "Product Management",
    level: "Senior",
    location: "New York, NY",
    workMode: "hybrid",
    team: "WhatsApp Business Growth",
    shortSummary:
      "Define growth bets and product strategy across messaging, monetization, and business tooling experiences.",
    officialApplyUrl: "https://www.metacareers.com/jobs/",
    postedAt: "2026-04-02T13:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active"
  },
  {
    sourceCompany: "microsoft",
    externalJobId: "MSF-10010",
    slug: "microsoft-design-manager-m365-copilot",
    title: "Design Manager",
    roleFamily: "Design & UX",
    level: "Manager",
    location: "Remote, US",
    workMode: "remote",
    team: "Microsoft 365 Copilot",
    shortSummary:
      "Lead a product design team shaping AI-assisted workflows across collaboration and productivity surfaces.",
    officialApplyUrl: "https://careers.microsoft.com/v2/global/en/search-results",
    postedAt: "2026-04-03T17:00:00.000Z",
    lastVerifiedAt: "2026-04-06T12:00:00.000Z",
    status: "active"
  }
];

export const resources: ResourceLink[] = [
  {
    title: "Amazon Leadership Principles",
    company: "amazon",
    resourceType: "principles",
    officialOrThirdParty: "official",
    url: "https://www.aboutamazon.com/about-us/leadership-principles",
    tags: ["behavioral", "leadership", "official"],
  },
  {
    title: "Amazon How We Hire",
    company: "amazon",
    resourceType: "official",
    officialOrThirdParty: "official",
    url: "https://www.amazon.jobs/content/en/how-we-hire",
    tags: ["interviews", "process", "official"],
  },
  {
    title: "Apple Careers",
    company: "apple",
    resourceType: "official",
    officialOrThirdParty: "official",
    url: "https://www.apple.com/careers/us/",
    tags: ["careers", "culture", "official"],
  },
  {
    title: "Google How We Hire",
    company: "google",
    resourceType: "official",
    officialOrThirdParty: "official",
    url: "https://www.google.com/about/careers/applications/how-we-hire",
    tags: ["process", "interviews", "official"],
  },
  {
    title: "Google Interview Tips",
    company: "google",
    resourceType: "interview",
    officialOrThirdParty: "official",
    url: "https://www.google.com/about/careers/applications/interview-tips",
    tags: ["interviews", "prep", "official"],
  },
  {
    title: "Meta SWE Onsite Prep",
    company: "meta",
    resourceType: "interview",
    officialOrThirdParty: "official",
    url: "https://www.metacareers.com/careers/SWE-prep-onsite",
    tags: ["engineering", "prep", "official"],
  },
  {
    title: "Microsoft Interview Tips",
    company: "microsoft",
    resourceType: "interview",
    officialOrThirdParty: "official",
    url: "https://careers.microsoft.com/us/en/interviewtips",
    tags: ["interviews", "prep", "official"],
  },
  {
    title: "Big Five Interview Planning Framework",
    resourceType: "guide",
    officialOrThirdParty: "third-party",
    url: "/prep",
    tags: ["playbook", "planning", "editorial"],
  }
];
