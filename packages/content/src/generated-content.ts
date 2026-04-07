import type { CompanyFrontmatter, GuideFrontmatter } from "./types";

export type EmbeddedCompanyHub = CompanyFrontmatter & { body: string; filePath: string };

export type EmbeddedGuide = GuideFrontmatter & { body: string; filePath: string };

export const embeddedCompanyHubs = [
  {
    body:
      "## How to prepare for Amazon\n\nAmazon interviews are often anchored in the Leadership Principles. Expect technical or functional depth, but also expect every interviewer to test judgment, scope, and ownership through examples from your past work.\n\n## What strong candidates do\n\n- Prepare specific stories with measurable outcomes.\n- Tie decisions back to customers, tradeoffs, and speed.\n- Practice concise written and verbal communication.\n\n## What to study\n\nReview role-specific fundamentals, then map your experience to principles such as ownership, bias for action, and delivering results.",
    filePath: "companies/amazon.mdx",
    slug: "amazon",
    title: "Amazon",
    summary:
      "Amazon candidates are evaluated for customer obsession, ownership, high standards, and practical execution in ambiguous environments.",
    principles: [
      "Customer obsession",
      "Ownership",
      "Bias for action",
      "Dive deep",
      "Deliver results",
    ],
    sourceLinks: [
      "https://www.aboutamazon.com/about-us/leadership-principles",
      "https://www.amazon.jobs/content/en/how-we-hire",
    ],
  },
  {
    body:
      "## How to prepare for Apple\n\nApple interviews often feel team-specific. Strong candidates show functional depth, excellent communication, and an ability to work closely with design, engineering, operations, or research partners.\n\n## What strong candidates do\n\n- Show where product taste changed a decision.\n- Demonstrate judgment under high expectations.\n- Bring examples of collaboration across disciplines.\n\n## What to study\n\nStudy the team's product area, refine your portfolio or case examples, and prepare to explain why your work improved quality for users.",
    filePath: "companies/apple.mdx",
    slug: "apple",
    title: "Apple",
    summary:
      "Apple tends to hire for craft, collaboration, product taste, and the ability to contribute at a very high quality bar within specialized teams.",
    principles: [
      "Craft and quality",
      "Cross-functional collaboration",
      "Product judgment",
      "Curiosity",
      "Detail orientation",
    ],
    sourceLinks: [
      "https://www.apple.com/careers/us/",
      "https://jobs.apple.com/en-us/search",
    ],
  },
  {
    body:
      "## How to prepare for Google\n\nGoogle uses structured interviews and written feedback. That means consistency matters: communication, problem solving, and evidence of prior impact all need to show up clearly across rounds.\n\n## What strong candidates do\n\n- Practice structured answers and clarifying questions.\n- Use frameworks instead of improvising under pressure.\n- Show leadership through influence, not only title.\n\n## What to study\n\nReview the published hiring guidance, then rehearse your functional fundamentals and behavioral stories with a strong emphasis on clarity.",
    filePath: "companies/google.mdx",
    slug: "google",
    title: "Google",
    summary:
      "Google looks for role-related knowledge, structured problem solving, leadership, and the collaboration signals often described as Googleyness.",
    principles: [
      "Role-related knowledge",
      "General cognitive ability",
      "Leadership",
      "Googleyness",
      "Collaboration",
    ],
    sourceLinks: [
      "https://www.google.com/about/careers/applications/how-we-hire",
      "https://www.google.com/about/careers/applications/interview-tips",
    ],
  },
  {
    body:
      "## How to prepare for Meta\n\nMeta interview loops often prioritize execution and product judgment. Candidates usually do best when they answer directly, quantify impact, and handle ambiguity with a bias toward action.\n\n## What strong candidates do\n\n- Show how they shipped meaningful work.\n- Demonstrate strong communication under time pressure.\n- Tie decisions to product impact and scale.\n\n## What to study\n\nFocus on functional depth, the pace of execution your role requires, and examples where you influenced outcomes across teams.",
    filePath: "companies/meta.mdx",
    slug: "meta",
    title: "Meta",
    summary:
      "Meta rewards speed, impact, communication, and the ability to work through open-ended product and execution problems.",
    principles: [
      "Move fast",
      "Focus on impact",
      "Be open",
      "Build social value",
      "Learn quickly",
    ],
    sourceLinks: [
      "https://www.metacareers.com/jobs/",
      "https://www.metacareers.com/careers/SWE-prep-onsite",
    ],
  },
  {
    body:
      "## How to prepare for Microsoft\n\nMicrosoft interviews usually blend problem solving, customer orientation, and cross-team collaboration. Strong candidates balance technical depth with thoughtful communication and product context.\n\n## What strong candidates do\n\n- Connect their work to customer value.\n- Show learning loops and growth over time.\n- Demonstrate partnership across organizations.\n\n## What to study\n\nPractice explaining complex decisions simply, prepare strong stories about collaboration, and study the business context behind the team you target.",
    filePath: "companies/microsoft.mdx",
    slug: "microsoft",
    title: "Microsoft",
    summary:
      "Microsoft hires for growth mindset, inclusive collaboration, customer impact, and strong execution across product, platform, and enterprise contexts.",
    principles: [
      "Growth mindset",
      "Customer obsession",
      "Collaboration",
      "Inclusion",
      "Accountability",
    ],
    sourceLinks: [
      "https://careers.microsoft.com/us/en/interviewtips",
      "https://careers.microsoft.com/v2/global/en/home.html",
    ],
  },
] satisfies EmbeddedCompanyHub[];

export const embeddedGuides = [
  {
    body:
      "## Focus areas\n\nBlend modeling rigor, experimentation judgment, and practical impact with strong stories around ownership and diving deep.\n\n## Winning signals\n\n- Experimental rigor\n- Business impact\n- Clear stakeholder communication",
    filePath: "guides/amazon-data-ml.mdx",
    slug: "amazon-data-ml",
    title: "Amazon Data & ML Interview Prep",
    company: "amazon",
    roleFamily: "Data & ML",
    guideType: "prep",
    readTime: "7 min",
    tags: ["experiments", "modeling", "leadership-principles"],
    sourceLinks: [
      "https://www.amazon.jobs/content/en/how-we-hire",
      "https://www.aboutamazon.com/about-us/leadership-principles",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare portfolio storytelling, customer understanding, tradeoff judgment, and examples showing speed without sacrificing quality.\n\n## Winning signals\n\n- Customer-centered design choices\n- Strong rationale\n- Cross-functional partnership",
    filePath: "guides/amazon-design-ux.mdx",
    slug: "amazon-design-ux",
    title: "Amazon Design & UX Interview Prep",
    company: "amazon",
    roleFamily: "Design & UX",
    guideType: "prep",
    readTime: "7 min",
    tags: ["portfolio", "research", "storytelling"],
    sourceLinks: [
      "https://www.amazon.jobs/content/en/how-we-hire",
      "https://www.aboutamazon.com/about-us/leadership-principles",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect customer problems, product judgment, metrics, prioritization, and principle-based behavioral depth.\n\n## Winning signals\n\n- Customer obsession\n- Written clarity\n- Strong prioritization logic",
    filePath: "guides/amazon-product-management.mdx",
    slug: "amazon-product-management",
    title: "Amazon Product Management Interview Prep",
    company: "amazon",
    roleFamily: "Product Management",
    guideType: "prep",
    readTime: "7 min",
    tags: ["strategy", "metrics", "leadership-principles"],
    sourceLinks: [
      "https://www.amazon.jobs/content/en/how-we-hire",
      "https://www.aboutamazon.com/about-us/leadership-principles",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare for coding depth, system design, and behavioral examples mapped to Amazon's Leadership Principles.\n\n## Winning signals\n\n- Clear tradeoff reasoning\n- Strong ownership stories\n- Fast, structured problem solving",
    filePath: "guides/amazon-software-engineering.mdx",
    slug: "amazon-software-engineering",
    title: "Amazon Software Engineering Interview Prep",
    company: "amazon",
    roleFamily: "Software Engineering",
    guideType: "prep",
    readTime: "7 min",
    tags: ["algorithms", "systems", "leadership-principles"],
    sourceLinks: [
      "https://www.amazon.jobs/content/en/how-we-hire",
      "https://www.aboutamazon.com/about-us/leadership-principles",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect questions on execution under ambiguity, risk management, stakeholder alignment, and behavioral ownership.\n\n## Winning signals\n\n- End-to-end execution\n- Mechanisms and planning\n- Strong principle mapping",
    filePath: "guides/amazon-tpm-program-management.mdx",
    slug: "amazon-tpm-program-management",
    title: "Amazon TPM / Program Management Interview Prep",
    company: "amazon",
    roleFamily: "TPM / Program Management",
    guideType: "prep",
    readTime: "7 min",
    tags: ["execution", "stakeholders", "leadership-principles"],
    sourceLinks: [
      "https://www.amazon.jobs/content/en/how-we-hire",
      "https://www.aboutamazon.com/about-us/leadership-principles",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect practical modeling questions, product application, and strong communication about privacy, performance, and user value.\n\n## Winning signals\n\n- Applied ML judgment\n- Responsible tradeoffs\n- High-quality communication",
    filePath: "guides/apple-data-ml.mdx",
    slug: "apple-data-ml",
    title: "Apple Data & ML Interview Prep",
    company: "apple",
    roleFamily: "Data & ML",
    guideType: "prep",
    readTime: "6 min",
    tags: ["modeling", "privacy", "product-impact"],
    sourceLinks: [
      "https://jobs.apple.com/en-us/search",
      "https://www.apple.com/careers/us/",
    ],
  },
  {
    body:
      "## Focus areas\n\nPortfolio reviews should highlight craft, systems thinking, usability, and how your work improved the end product.\n\n## Winning signals\n\n- Exceptional craft\n- Strong critique readiness\n- Evidence of quality",
    filePath: "guides/apple-design-ux.mdx",
    slug: "apple-design-ux",
    title: "Apple Design & UX Interview Prep",
    company: "apple",
    roleFamily: "Design & UX",
    guideType: "prep",
    readTime: "6 min",
    tags: ["portfolio", "craft", "systems"],
    sourceLinks: [
      "https://jobs.apple.com/en-us/search",
      "https://www.apple.com/careers/us/",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare for product judgment, crisp communication, roadmap tradeoffs, and examples of shipping quality experiences with many partners.\n\n## Winning signals\n\n- Taste and judgment\n- Cross-functional influence\n- Clear communication",
    filePath: "guides/apple-product-management.mdx",
    slug: "apple-product-management",
    title: "Apple Product Management Interview Prep",
    company: "apple",
    roleFamily: "Product Management",
    guideType: "prep",
    readTime: "6 min",
    tags: ["product-sense", "roadmaps", "collaboration"],
    sourceLinks: [
      "https://jobs.apple.com/en-us/search",
      "https://www.apple.com/careers/us/",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect strong emphasis on code quality, architecture decisions, product context, and collaboration with specialized partners.\n\n## Winning signals\n\n- Attention to detail\n- Strong technical depth\n- Product-minded execution",
    filePath: "guides/apple-software-engineering.mdx",
    slug: "apple-software-engineering",
    title: "Apple Software Engineering Interview Prep",
    company: "apple",
    roleFamily: "Software Engineering",
    guideType: "prep",
    readTime: "6 min",
    tags: ["architecture", "quality", "collaboration"],
    sourceLinks: [
      "https://jobs.apple.com/en-us/search",
      "https://www.apple.com/careers/us/",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare examples that show exacting execution, operational rigor, and coordination across hardware, software, and business teams.\n\n## Winning signals\n\n- High standards\n- Clear communication\n- Reliable execution",
    filePath: "guides/apple-tpm-program-management.mdx",
    slug: "apple-tpm-program-management",
    title: "Apple TPM / Program Management Interview Prep",
    company: "apple",
    roleFamily: "TPM / Program Management",
    guideType: "prep",
    readTime: "6 min",
    tags: ["operations", "execution", "stakeholder-management"],
    sourceLinks: [
      "https://jobs.apple.com/en-us/search",
      "https://www.apple.com/careers/us/",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect statistics, modeling, experimentation, and the ability to explain technical recommendations to product partners.\n\n## Winning signals\n\n- Strong analytical rigor\n- Clear recommendations\n- Business-aware reasoning",
    filePath: "guides/google-data-ml.mdx",
    slug: "google-data-ml",
    title: "Google Data & ML Interview Prep",
    company: "google",
    roleFamily: "Data & ML",
    guideType: "prep",
    readTime: "7 min",
    tags: ["statistics", "experiments", "communication"],
    sourceLinks: [
      "https://www.google.com/about/careers/applications/how-we-hire",
      "https://www.google.com/about/careers/applications/interview-tips",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare portfolio reviews with strong problem framing, system thinking, research insights, and collaboration narratives.\n\n## Winning signals\n\n- Clear framing\n- Data-informed design\n- Excellent storytelling",
    filePath: "guides/google-design-ux.mdx",
    slug: "google-design-ux",
    title: "Google Design & UX Interview Prep",
    company: "google",
    roleFamily: "Design & UX",
    guideType: "prep",
    readTime: "7 min",
    tags: ["portfolio", "research", "systems"],
    sourceLinks: [
      "https://www.google.com/about/careers/applications/how-we-hire",
      "https://www.google.com/about/careers/applications/interview-tips",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare product sense, strategy, prioritization, and leadership answers that stay structured and measurable.\n\n## Winning signals\n\n- Framework-based answers\n- User empathy\n- Metrics fluency",
    filePath: "guides/google-product-management.mdx",
    slug: "google-product-management",
    title: "Google Product Management Interview Prep",
    company: "google",
    roleFamily: "Product Management",
    guideType: "prep",
    readTime: "7 min",
    tags: ["product-sense", "strategy", "leadership"],
    sourceLinks: [
      "https://www.google.com/about/careers/applications/how-we-hire",
      "https://www.google.com/about/careers/applications/interview-tips",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect algorithmic problem solving, scalable design, and structured communication that shows both depth and collaboration.\n\n## Winning signals\n\n- Structured thinking\n- Strong fundamentals\n- Clear collaboration examples",
    filePath: "guides/google-software-engineering.mdx",
    slug: "google-software-engineering",
    title: "Google Software Engineering Interview Prep",
    company: "google",
    roleFamily: "Software Engineering",
    guideType: "prep",
    readTime: "7 min",
    tags: ["coding", "systems", "googliness"],
    sourceLinks: [
      "https://www.google.com/about/careers/applications/how-we-hire",
      "https://www.google.com/about/careers/applications/interview-tips",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect questions on execution, technical judgment, planning, and leading through influence without losing structure.\n\n## Winning signals\n\n- Program clarity\n- Technical fluency\n- Leadership without authority",
    filePath: "guides/google-tpm-program-management.mdx",
    slug: "google-tpm-program-management",
    title: "Google TPM / Program Management Interview Prep",
    company: "google",
    roleFamily: "TPM / Program Management",
    guideType: "prep",
    readTime: "7 min",
    tags: ["execution", "systems", "leadership"],
    sourceLinks: [
      "https://www.google.com/about/careers/applications/how-we-hire",
      "https://www.google.com/about/careers/applications/interview-tips",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare for experiment design, ranking or modeling tradeoffs, and recommendations that emphasize impact and speed.\n\n## Winning signals\n\n- Impact orientation\n- Experimental fluency\n- Clear stakeholder communication",
    filePath: "guides/meta-data-ml.mdx",
    slug: "meta-data-ml",
    title: "Meta Data & ML Interview Prep",
    company: "meta",
    roleFamily: "Data & ML",
    guideType: "prep",
    readTime: "6 min",
    tags: ["experiments", "ml", "product-impact"],
    sourceLinks: [
      "https://www.metacareers.com/jobs/",
      "https://www.metacareers.com/careers/SWE-prep-onsite",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect portfolio discussion, product sense, critique, and examples where design directly improved user outcomes.\n\n## Winning signals\n\n- Strong product framing\n- Fast iteration stories\n- Cross-functional influence",
    filePath: "guides/meta-design-ux.mdx",
    slug: "meta-design-ux",
    title: "Meta Design & UX Interview Prep",
    company: "meta",
    roleFamily: "Design & UX",
    guideType: "prep",
    readTime: "6 min",
    tags: ["portfolio", "product-thinking", "communication"],
    sourceLinks: [
      "https://www.metacareers.com/jobs/",
      "https://www.metacareers.com/careers/SWE-prep-onsite",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect product sense, execution, metrics, and prioritization questions that reward direct communication and impact orientation.\n\n## Winning signals\n\n- Sharp product judgment\n- Clear metrics thinking\n- Execution bias",
    filePath: "guides/meta-product-management.mdx",
    slug: "meta-product-management",
    title: "Meta Product Management Interview Prep",
    company: "meta",
    roleFamily: "Product Management",
    guideType: "prep",
    readTime: "6 min",
    tags: ["product-sense", "execution", "impact"],
    sourceLinks: [
      "https://www.metacareers.com/jobs/",
      "https://www.metacareers.com/careers/SWE-prep-onsite",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare coding rounds, system design, and examples that show impact at pace under open-ended conditions.\n\n## Winning signals\n\n- Fast execution\n- Strong fundamentals\n- Practical decision making",
    filePath: "guides/meta-software-engineering.mdx",
    slug: "meta-software-engineering",
    title: "Meta Software Engineering Interview Prep",
    company: "meta",
    roleFamily: "Software Engineering",
    guideType: "prep",
    readTime: "6 min",
    tags: ["coding", "systems", "execution"],
    sourceLinks: [
      "https://www.metacareers.com/careers/SWE-prep-onsite",
      "https://www.metacareers.com/jobs/",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare stories around fast execution, risk management, stakeholder leadership, and driving clarity in evolving programs.\n\n## Winning signals\n\n- Decisive execution\n- Clear communication\n- Strong prioritization",
    filePath: "guides/meta-tpm-program-management.mdx",
    slug: "meta-tpm-program-management",
    title: "Meta TPM / Program Management Interview Prep",
    company: "meta",
    roleFamily: "TPM / Program Management",
    guideType: "prep",
    readTime: "6 min",
    tags: ["execution", "ambiguity", "stakeholders"],
    sourceLinks: [
      "https://www.metacareers.com/jobs/",
      "https://www.metacareers.com/careers/SWE-prep-onsite",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect analytical rigor, model or experiment design, and business communication tied to real customer and platform outcomes.\n\n## Winning signals\n\n- Practical rigor\n- Clear recommendations\n- Customer focus",
    filePath: "guides/microsoft-data-ml.mdx",
    slug: "microsoft-data-ml",
    title: "Microsoft Data & ML Interview Prep",
    company: "microsoft",
    roleFamily: "Data & ML",
    guideType: "prep",
    readTime: "6 min",
    tags: ["statistics", "modeling", "impact"],
    sourceLinks: [
      "https://careers.microsoft.com/us/en/interviewtips",
      "https://careers.microsoft.com/v2/global/en/home.html",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare a portfolio that shows systems thinking, customer empathy, accessibility, and collaboration across engineering and product.\n\n## Winning signals\n\n- Inclusive design thinking\n- Systems fluency\n- Clear critique process",
    filePath: "guides/microsoft-design-ux.mdx",
    slug: "microsoft-design-ux",
    title: "Microsoft Design & UX Interview Prep",
    company: "microsoft",
    roleFamily: "Design & UX",
    guideType: "prep",
    readTime: "6 min",
    tags: ["portfolio", "systems", "accessibility"],
    sourceLinks: [
      "https://careers.microsoft.com/us/en/interviewtips",
      "https://careers.microsoft.com/v2/global/en/home.html",
    ],
  },
  {
    body:
      "## Focus areas\n\nPrepare to connect product choices to customer outcomes, business context, prioritization, and healthy cross-team execution.\n\n## Winning signals\n\n- Customer empathy\n- Strategic clarity\n- Strong partnership",
    filePath: "guides/microsoft-product-management.mdx",
    slug: "microsoft-product-management",
    title: "Microsoft Product Management Interview Prep",
    company: "microsoft",
    roleFamily: "Product Management",
    guideType: "prep",
    readTime: "6 min",
    tags: ["strategy", "metrics", "customer-focus"],
    sourceLinks: [
      "https://careers.microsoft.com/us/en/interviewtips",
      "https://careers.microsoft.com/v2/global/en/home.html",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect coding, design, collaboration, and customer impact questions with an emphasis on learning mindset.\n\n## Winning signals\n\n- Strong fundamentals\n- Customer-aware design\n- Collaborative communication",
    filePath: "guides/microsoft-software-engineering.mdx",
    slug: "microsoft-software-engineering",
    title: "Microsoft Software Engineering Interview Prep",
    company: "microsoft",
    roleFamily: "Software Engineering",
    guideType: "prep",
    readTime: "6 min",
    tags: ["coding", "design", "growth-mindset"],
    sourceLinks: [
      "https://careers.microsoft.com/us/en/interviewtips",
      "https://careers.microsoft.com/v2/global/en/home.html",
    ],
  },
  {
    body:
      "## Focus areas\n\nExpect delivery planning, risk management, customer context, and examples of coordinating through complex dependencies.\n\n## Winning signals\n\n- Reliable execution\n- Structured planning\n- Inclusive collaboration",
    filePath: "guides/microsoft-tpm-program-management.mdx",
    slug: "microsoft-tpm-program-management",
    title: "Microsoft TPM / Program Management Interview Prep",
    company: "microsoft",
    roleFamily: "TPM / Program Management",
    guideType: "prep",
    readTime: "6 min",
    tags: ["execution", "planning", "collaboration"],
    sourceLinks: [
      "https://careers.microsoft.com/us/en/interviewtips",
      "https://careers.microsoft.com/v2/global/en/home.html",
    ],
  },
] satisfies EmbeddedGuide[];
