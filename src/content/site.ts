/* ─────────────────────────────────────────────────────────────
   ALL SITE COPY LIVES HERE.
   Every string the visitor reads is in this file - no copy is
   hardcoded in components. Placeholders are written in CAPS so
   they're impossible to miss. Replace them and the whole site
   updates.
   ───────────────────────────────────────────────────────────── */

export const profile = {
  /* Drives the nav wordmark, the hero H1, the page title and the
     footer copyright. */
  fullName: "Siddharth Chadha",

  /* The nav wordmark below the `sm` breakpoint only. At 390px the
     portrait, the full name, CONTACT and the menu icon overflow the
     pill's inner width and wrap to a second row - so the name gets
     shorter rather than disappearing, which is what it used to do. */
  shortName: "Sid",

  role: "AI Product Manager",

  /* The hero H1. */
  headline: "First principles over precedent. Signal over noise.",

  /* Sits under the headline, doing the job of an About section.
     Rendered at body size, not subheading - at 20px a paragraph this
     long turns into a wall on a half-width column. */
  bio: "Five years across consulting, strategy and product, now building AI products where the hard part isn't the model, it's deciding what's worth building. Reached this work through data and analytics, which is why the instinct is always to check the number before the narrative. Comfortable at the front of a problem: the stage where there's no roadmap, no benchmark, and the job is to establish what's actually true.",

  /* Meta description only. Kept separate from `bio` because search
     results truncate around 155 characters. */
  description:
    "Siddharth Chadha, AI product manager and 0→1 builder. First principles over precedent. Signal over noise.",

  /* Square portrait in /public, cropped around the face. Used only by
     the nav wordmark, where it renders as a small circle. */
  avatar: "/portrait.jpg",

  email: "siddharth.chadha7@gmail.com",

} as const;

/* ── COMPANIES & CLIENTS ──────────────────────────────────────
   Name strip below the hero. Names only, no logos: the marks came in
   at wildly different weights and grounds, and a row of mismatched
   chips read worse than a clean line of wordmarks.

   (Company logos are still used on the work cards, which is what
   /public/logos is for.) */

export type Client = {
  name: string;
};

export const clients: { title: string; items: Client[] } = {
  title: "Notable companies & clients worked with",
  items: [
    { name: "Deloitte USI" },
    { name: "Sanofi" },
    { name: "BlueUrbn" },
    { name: "Stanford" },
    { name: "NodeOps" },
    { name: "Google for Startups" },
    { name: "Aethir" },
    { name: "0G Labs" },
  ],
};

/* Sits under the hero bio as a row of pills.

   Each carries its own dot colour. This is the one place the site
   leaves its near-monochrome palette - the colour is confined to an
   8px dot, with the pill itself staying neutral, so the row reads as
   coded rather than as seven competing brand colours. */
export const industries = {
  title: "Industry experience in:",
  items: [
    { name: "Artificial Intelligence", color: "#002fa7" },
    { name: "Blockchain & Web3", color: "#7c3aed" },
    { name: "Cloud Infrastructure", color: "#0ea5e9" },
    { name: "ESG & Sustainability", color: "#16a34a" },
    { name: "Healthcare", color: "#e11d48" },
    { name: "Real Estate", color: "#d97706" },
    { name: "Finance", color: "#0f766e" },
  ],
} as const;

/* Pull quote standing in for the Work section header. */
export const workQuote = {
  text: "It is impossible to have a great life unless it is a meaningful life. And it is very difficult to have a meaningful life without meaningful work.",
  author: "Jim Collins",
} as const;

/* The assistant in the "Ask about me" section. Named and given a face
   so a visitor knows they are talking to Sid's agent rather than to
   Sid - which also makes the third-person voice read as deliberate
   rather than as a bot that cannot say "I". */
export const assistant = {
  name: "Arthur",
  role: "Sid's agent",
  avatar: "/arthur.png",
} as const;

/* Opens /books, above the bucket menu. */
export const booksQuote = {
  text: "You don't understand anything until you learn it more than one way.",
  author: "Marvin Minsky",
} as const;

/* ── TIMELINE (education) ──────────────────────────────────────
   The timeline renders the roles in `work` first, then these. Roles
   are not duplicated here so the two can never drift apart.

   TODO: years. The CV dates the roles but not the studies, so these
   deliberately carry no period rather than an invented one. */

/** A post held within a study entry, e.g. the IAESTE progression. */
export type Post_ = {
  title: string;
  /** Optional: not every post in the progression has a stated year. */
  period?: string;
  /**
   * Square mark in /public/logos. Optional because a progression of
   * posts inside one organisation shares that organisation's logo -
   * only a list of separate employers, like the internships, needs a
   * mark per entry.
   */
  logo?: string;
  points: string[];
};

export type Study = {
  id: string;
  /** Square mark in /public/logos. */
  logo?: string;
  /**
   * Drawn-in-code mark, for an entry that stands for a group of
   * things rather than one organisation - there is no logo for
   * "Internships". Inline rather than a file so it cannot 404.
   */
  icon?: "briefcase";
  href?: string;
  /** Overrides the default "VISIT" wording on the link. */
  linkLabel?: string;
  /** Successive posts, earliest last, shown as a nested progression. */
  posts?: Post_[];
  period?: string;
  institution: string;
  stream?: string;
  note?: string;
  achievements?: string[];
  /** Sub-entries rendered indented beneath, e.g. a programme. */
  children?: Study[];
};

export const education: Study[] = [
  {
    id: "manipal",
    period: "2017 - 2021",
    logo: "/logos/manipal.png",
    institution: "Manipal Institute of Technology, Manipal",
    stream: "Electronics and Communication Engineering, minor in Data Science",
    achievements: [
      "TEDx Manipal organiser",
      "MIT Football League",
      "Lumos, a dentistry project: provisional patent, since expired",
      "Lumos: top 15 medical prototypes at the AIIMS Delhi dentistry convention",
    ],
    children: [
      {
        id: "internships",
        icon: "briefcase",
        institution: "Internships",
        stream: "2019 - 2021",
        note: "Four stints alongside the degree, across neural networks, equity research, applied machine learning and corporate finance.",
        posts: [
          {
            title: "Shadowed Consulting Haus Director",
            logo: "/logos/consulting-haus.png",
            period: "May 2021 - Sep 2021",
            points: [
              "Shadowed the Director of Corporate Finance Strategy, evaluating Islamic financial instruments for an NBFC.",
              "Benchmarked 200+ NBFCs and banks across the GCC, covering both corporate and retail customers.",
            ],
          },
          {
            title: "Equity Research Analyst, Fincrux Technologies",
            period: "Jul 2020 - Sep 2020",
            points: [
              "Invested INR 2L at an average return of 21.25% across BSE-listed companies, on a real-time trade simulator.",
              "Used fundamental and technical analysis to evaluate company performance against the market.",
            ],
          },
          {
            title: "Data Science Intern, Alpha AI",
            logo: "/logos/alpha-ai.png",
            period: "2019",
            points: [
              "Built a recommendation algorithm for solo and group travel handling 1M+ users, delivered three weeks ahead of schedule.",
              "Led a team of 4 interns and 2 psychologists to fold personality traits into the recommendations.",
              "Combined collaborative and content-based filtering, improving the system's efficacy by 60%.",
              "Generated deep fakes to automate content production for edtech practitioners, cutting man-hours by 40%.",
              "Applied GAN-based generative modelling to improve video content generation.",
            ],
          },
          {
            title: "Neural Networks Intern, UNESP, São Paulo",
            logo: "/logos/unesp.png",
            period: "Jun 2019 - Jul 2019",
            points: [
              "Built a neural network in the MATLAB NN toolbox that took GDP, exports, imports, inflation and interest rates across 20 years to predict the value of the Indian rupee, accurate to 96%.",
            ],
          },
        ],
      },
      {
        id: "iaeste",
        institution: "IAESTE India",
        logo: "/logos/iaeste.png",
        href: "https://iaeste.in/",
        stream: "2017 - 2020",
        note: "Four posts across three years: local operations, then quality, then the national committee, plus a global task force.",
        posts: [
          {
            title: "Local Committee Task Force Leader, elected",
            period: "2019 - 2020",
            points: [
              "Elected to transform LC networks globally, working with counterparts across 4+ countries including Turkey, Brazil, Poland and Germany.",
              "Built strategies for the internal functioning of APAC countries, strengthening and streamlining their systems and processes.",
              "Advised the global IAESTE IT team.",
            ],
          },
          {
            title: "National Secretary, National Committee IAESTE India",
            period: "2019 - 2020",
            points: [
              "Represented India at the 2020 Annual General Conference in Slovakia.",
              "Increased National Committee savings by 68% and launched 2 new revenue streams.",
              "Exchanged the 2nd-highest number of offers globally, up 16% year-over-year.",
              "Designed an app to digitise the global offer-exchange process, cutting processing time, eliminating ~15k sheets of paper and improving analytical insights; adopted by the IAESTE A.s.b.l. Board.",
            ],
          },
          {
            title: "Total Quality Manager, LC Manipal",
            period: "2018 - 2019",
            points: [
              "Implemented internal department-wide efficiency audits.",
              "Managed IAESTE LC Manipal's support system.",
            ],
          },
          {
            title: "Local Committee Member, LC Manipal",
            period: "2017 - 2018",
            points: [
              "Handled the operational work of LC Manipal.",
              "As Summer Reception Officer, managed the incoming of 80+ foreign nationals across 30+ countries.",
              "FRRO in-charge, handling police verification for select countries.",
            ],
          },
        ],
      },
      {
        id: "revx",
        logo: "/logos/manipal.png",
        institution: "RevX, Manipal Incubation Center",
        stream: "2018 - 2019",
        href: "https://timesofindia.indiatimes.com/city/mangaluru/innovations-for-a-better-tomorrow-on-display-at-manipal/articleshow/74420620.cms",
        linkLabel: "TIMES OF INDIA ARTICLE",
        note: "An electric scooter built at the Manipal Incubation Center: old scooters headed for scrap, converted rather than replaced.",
        achievements: [
          "Handled the electronic components and their wiring into the BMS: indicators, headlights and horn.",
          "Worked on the chassis assembly for the battery and BMS.",
          "Secured an initial grant of INR 50,000.",
          "The first prototype ran up to 60km on two hours of charging, at a build cost of around INR 45,000.",
          "The team applied for a patent, with motorbikes lined up next.",
        ],
      },
    ],
  },
  {
    id: "school",
    period: "2012 - 2017",
    logo: "/logos/shri-ram.png",
    institution: "The Shri Ram School, Aravali",
    stream: "Physics, Maths, Chemistry and Technical Drawing",
    achievements: [
      "92% across the ICSE and ISC boards",
      "Board topper in Engineering and Technical Drawing, 100%",
      "Football and athletics teams; vice-captain of athletics",
      "Played the Subroto Cup representing Delhi NCR, India's third biggest football tournament",
      "Represented Delhi at NWR regionals and ISC nationals in football and athletics",
      "Best Athlete of the Year, sub-junior category",
      "30+ medals across all school years",
    ],
  },
];

export const socials = [
  {
    label: "LINKEDIN",
    icon: "linkedin",
    href: "https://www.linkedin.com/in/sid625/",
  },
  { label: "X", icon: "x", href: "https://x.com/Sid_625" },
  {
    label: "EMAIL",
    icon: "mail",
    href: "mailto:siddharth.chadha7@gmail.com",
  },
] as const;

export const nav = [
  { label: "WORK", href: "/work" },
  { label: "PROJECTS", href: "/projects" },
  { label: "WRITING", href: "/writing" },
  { label: "LEARNINGS", href: "/books" },
] as const;

/* ── WORK ─────────────────────────────────────────────────── */

export type Role = {
  /** URL segment for the role's detail page: /work/<slug>. */
  slug: string;
  company: string;
  /** Square mark in /public/logos. */
  logo?: string;
  role: string;
  period: string;
  /** Affiliation or client, shown next to the company. */
  context?: string;
  /** One-line summary. This is what the homepage preview shows. */
  blurb: string;
  /** Detail, shown only on /work. Keeps the metrics off the homepage
   *  without throwing them away. */
  highlights?: string[];
  /** Headline numbers. Rendered as chips where space is tight (cards,
   *  carousel) and as explained bullets in the timeline, so one source
   *  drives both. The notes are drawn from the highlights below. */
  impact?: { metric: string; note: string }[];
  href?: string;
  /** The product this role shipped, linked separately from the company. */
  product?: { name: string; href: string };
};

export const work: Role[] = [
  {
    slug: "nodeops",
    company: "NodeOps",
    logo: "/logos/nodeops.png",
    role: "Product Manager, CreateOS",
    period: "2024 - Present",
    context: "Google for Startups, India Class of 2026",
    blurb:
      "CreateOS is a unified workspace to build, deploy, and scale apps: no DevOps, no tool sprawl. Eliminate complexity and ship faster with an all-in-one workflow built for speed, focus, and product momentum.",
    highlights: [
      "Launched CreateOS, an AI-native zero-code platform to build and deploy applications; scaled to 10,000+ users in the first quarter via GTM across a 70,000+ developer community with a 5-person engineering team. Ranked #1 Product of the Day on Product Hunt.",
      "Replaced manual YAML/Docker setup with AI-assisted GitHub CI/CD, closing the build-to-deploy gap. Drove 4.9M+ build hours, 20K+ deployments and 12K+ vibe-coding sessions.",
      "Designed a unified credit system merging deployment and AI-generation billing, driving a 120% increase in revenue the following month.",
      "Proposed the pivot from Web3-only node deployments to a deployments-first strategy. Backed it with subscription data, crypto market cycles and an early node-sale downtrend, then validated it with Web3 developer surveys: users could vibe-code front-ends but stalled at deployment.",
      "Scaled the Node-as-a-Service launchpad to 65+ protocols, letting retail users run nodes with zero configuration. Reached $160M+ AUM, 300K+ wallets and $4.3M+ revenue.",
      "Built a data analytics, tracking and Sybil-detection pipeline from scratch, flagging 95%+ of Sybil wallets across 10M+ wallets and saving $15K in tooling.",
    ],
    impact: [
      {
        metric: "10,000+ users in Q1",
        note: "CreateOS in its first quarter, via GTM across a 70,000+ developer community with a five-person engineering team.",
      },
      {
        metric: "#1 Product of the Day",
        note: "CreateOS ranked first on Product Hunt.",
      },
      {
        metric: "120% revenue lift",
        note: "In the month after shipping a unified credit system that merged deployment and AI-generation billing.",
      },
      {
        metric: "$160M+ AUM",
        note: "On the Node-as-a-Service launchpad, alongside 300K+ wallets and $4.3M+ revenue across 65+ protocols.",
      },
      {
        metric: "4.9M+ build hours",
        note: "After replacing manual YAML and Docker setup with AI-assisted GitHub CI/CD, plus 20K+ deployments.",
      },
      {
        metric: "95%+ Sybil detection",
        note: "Across 10M+ wallets, from an analytics and detection pipeline built from scratch that replaced $15K of tooling.",
      },
    ],
    href: "https://nodeops.xyz",
    product: { name: "CreateOS", href: "https://createos.sh/" },
  },
  {
    slug: "blueurbn",
    company: "BlueUrbn",
    logo: "/logos/blueurbn.png",
    role: "Product Lead, Nexus",
    period: "2023 - 2024",
    context: "Stanford-incubated",
    blurb:
      "Led Nexus, a rebates engine helping commercial buildings adopt energy-efficient systems, cutting payback periods by 30% on average.",
    highlights: [
      "Surfaced federal, state and utility incentives across New York and California, cutting payback periods by 30% on average.",
      "Cut incentive research from 8–9 hours to 30–60 minutes (~90% faster) by aggregating 380+ rebate programs across 30+ products into one searchable engine; workflow validated by the Director of Buro Happold.",
      "Ran discovery with building-energy scientists, MEP firms and engineering partners to define the product, securing 5+ enterprise MoUs and shipping 15+ features across the Nexus calculator and Retro energy-model MVP.",
      "Owned incentive logic and compliance research across IRA, ITC, PTC and utility programs (PG&E, NYSERDA), aligning the product to ASHRAE, Title 24 (CCR) and DOE standards.",
    ],
    impact: [
      {
        metric: "30% shorter payback",
        note: "Average reduction for commercial buildings adopting energy-efficient systems.",
      },
      {
        metric: "~90% faster research",
        note: "Incentive research fell from 8 to 9 hours down to 30 to 60 minutes.",
      },
      {
        metric: "380+ rebate programs",
        note: "Aggregated across 30+ products into a single searchable engine.",
      },
      {
        metric: "5+ enterprise MoUs",
        note: "Secured through discovery with building-energy scientists, MEP firms and engineering partners.",
      },
    ],
    href: "https://www.linkedin.com/company/blueurbn/about/",
  },
  {
    slug: "deloitte-usi",
    company: "Deloitte USI",
    logo: "/logos/deloitte-usi.png",
    period: "2021 - 2023",
    role: "Business Technology Analyst",
    context: "Client: global pharmaceutical company",
    blurb:
      "Built the data foundation behind a deep-learning sales-optimization model, lifting sales 22%+ the following cycle across a 350+ rep field force.",
    highlights: [
      "Lifted sales 22%+ the following cycle by optimizing per-rep channel mix, frequency and spend across a 350+ rep field force.",
      "Engineered the model-ready dataset (MRDS) and pre-processing pipeline powering a deep-learning sales-optimization model deployed across 20+ markets.",
      "Owned the data foundation for 8+ markets, consolidating fragmented sources (SQL, text, Excel) into clean, feature-rich training data for omnichannel HCP targeting across in-person, events, calls, email and WhatsApp.",
      "Handled 10+ countries spanning APAC and EU.",
    ],
    impact: [
      {
        metric: "22%+ sales lift",
        note: "In the cycle after optimising per-rep channel mix, frequency and spend.",
      },
      {
        metric: "10+ countries",
        note: "Coverage spanning APAC and EU.",
      },
      {
        metric: "20+ markets",
        note: "Where the deep-learning sales-optimisation model was deployed.",
      },
      {
        metric: "350+ rep field force",
        note: "The size of the field force the model optimised.",
      },
    ],
    href: "https://www.deloitte.com/",
  },
];

/* ── PROJECTS ─────────────────────────────────────────────── */

export type Project = {
  title: string;
  blurb: string;
  tags: readonly string[];
  href?: string;
  year: string;
};

/* Drawn from the products shipped inside the roles above. Years are
   inferred from each role's period - the CV dates the roles, not the
   individual products, so correct any that are off. */
export const projects: Project[] = [
  {
    title: "CreateOS",
    blurb:
      "An AI-native zero-code platform for building and deploying applications. Scaled to 10,000+ users in its first quarter with a 5-person engineering team, and ranked #1 Product of the Day on Product Hunt.",
    tags: ["AI", "ZERO-CODE", "GTM"],
    year: "2025",
  },
  {
    title: "AI-assisted CI/CD",
    blurb:
      "Replaced manual YAML and Docker setup with AI-assisted GitHub CI/CD, closing the gap between building an app and getting it deployed. Drove 4.9M+ build hours and 20K+ deployments.",
    tags: ["CI/CD", "DEVELOPER TOOLS"],
    year: "2025",
  },
  {
    title: "Node-as-a-Service launchpad",
    blurb:
      "Scaled to 65+ protocols, letting retail users run nodes with zero configuration. Reached $160M+ AUM, 300K+ wallets and $4.3M+ in revenue.",
    tags: ["WEB3", "INFRASTRUCTURE"],
    year: "2024",
  },
  {
    title: "Sybil-detection pipeline",
    blurb:
      "Built from scratch: analytics, tracking and Sybil detection flagging 95%+ of Sybil wallets across 10M+ wallets, replacing $15K of tooling.",
    tags: ["DATA", "ANALYTICS"],
    year: "2024",
  },
  {
    title: "Nexus",
    blurb:
      "A rebates engine helping commercial buildings adopt energy-efficient systems. Aggregating 380+ rebate programs cut incentive research from 8–9 hours to under an hour, and payback periods by 30%.",
    tags: ["ENERGY", "COMPLIANCE"],
    year: "2023",
  },
];

/* ── WRITING ──────────────────────────────────────────────── */

export type Post = {
  title: string;
  date: string; // ISO - formatted for display at render time
  blurb: string;
  href: string;
  /** Omit for things that aren't articles, e.g. a thread. */
  readingTime?: string;
  /** Where it was published, shown as a tag. */
  source?: string;
  /**
   * Path to an image in /public, e.g. "/writing/memory.jpg".
   *
   * Left unset the row falls back to the brand sphere, the same
   * treatment the project cards use. Medium blocks automated requests
   * (403) so the real cover images could not be pulled down - save them
   * into /public and set this to use them.
   */
  thumbnail?: string;
};

export const posts: Post[] = [
  {
    title: "What Does Your AI Actually Remember About You?",
    date: "2026-07-31",
    blurb:
      "Models don't remember anything. An externally curated memory folder is assembled for each conversation, which makes curation matter far more than capacity.",
    href: "https://medium.com/@siddharth.chadha7/what-does-your-ai-actually-remember-about-you-abdff40ca333",
    readingTime: "6 MIN",
    source: "MEDIUM",
  },
  {
    title: "The AI Restaurant That Lives Inside Your Computer",
    date: "2026-02-26",
    blurb:
      "System prompts, context windows, tokens, MCP and orchestration explained through one extended restaurant analogy, for people who don't build these systems.",
    href: "https://medium.com/@sid_24024/the-ai-restaurant-that-lives-inside-your-computer-32f67a51b206",
    readingTime: "10 MIN",
    source: "MEDIUM",
  },
  {
    /* X returns 402 to automated requests, so none of this could be
       read from the post itself - fill in the title and summary. */
    title: "POST TITLE (ADD)",
    date: "2026-01-01", // TODO: real date
    blurb: "ONE-LINE SUMMARY (ADD)",
    href: "https://x.com/Sid_625/status/2054542233018507745",
    source: "X",
  },
];

/* ── BOOKS ────────────────────────────────────────────────── */

/* Three buckets, chosen so the shelf splits by *what a book is about*
   rather than by when it was read. A year filter tells a visitor
   nothing; "is this person reading about AI or about consciousness"
   tells them a lot.

   Order here is the order of the menu on /books. */
export const bookBuckets = [
  "Books",
  "AI & Tech",
  "Science & Spirituality",
] as const;

export type BookBucket = (typeof bookBuckets)[number];

export type Book = {
  /* Stable unique key. Title+author isn't reliable - you can read two
     editions of the same book, or reread one across years. */
  id: string;
  title: string;
  author: string;
  bucket: BookBucket;
  /* Cover art, dropped into /public/covers. The shelf falls back to a
     typographic cover both when this is unset and when the file 404s,
     so a wrong path degrades instead of showing a broken image. */
  cover?: string;
  /* Still reading. These carry no takeaway - the whole point of the
     line below is that it survived finishing the book. */
  inProgress?: boolean;
  /* The one thing I remember, in my own words. Rendered in quotes.
     Omitted for anything still in progress. */
  remember?: string;
};

export const books: Book[] = [
  {
    id: "meluha",
    title: "The Immortals of Meluha",
    author: "Amish Tripathi",
    bucket: "Books",
    cover: "/covers/immortals-of-meluha.png",
    remember: "The good in you is as much you as the evil in you.",
  },
  {
    id: "nagas",
    title: "The Secret of the Nagas",
    author: "Amish Tripathi",
    bucket: "Books",
    cover: "/covers/secret-of-the-nagas.png",
    remember: "Real power is not always to show.",
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    bucket: "Books",
    cover: "/covers/psychology-of-money.png",
    remember: "Real wealth is not seen.",
  },
  {
    id: "subtle-art",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    bucket: "Books",
    cover: "/covers/subtle-art.png",
    remember: "Meditation is a mock of death.",
  },
  {
    id: "mindset",
    title: "Mindset",
    author: "Carol S. Dweck",
    bucket: "Books",
    cover: "/covers/mindset.png",
    remember:
      "Be mindful enough to know if you have a growth or a fixed mindset.",
  },
  {
    id: "hard-things",
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    bucket: "Books",
    cover: "/covers/hard-thing-about-hard-things.png",
    inProgress: true,
  },
  {
    id: "hooked",
    title: "Hooked",
    author: "Nir Eyal",
    bucket: "Books",
    cover: "/covers/hooked.png",
    inProgress: true,
  },
  {
    id: "psycho-cybernetics",
    title: "Psycho-Cybernetics",
    author: "Maxwell Maltz",
    bucket: "Books",
    cover: "/covers/psycho-cybernetics.png",
    remember: "Understanding self image, and how it influences our decisions.",
  },
  {
    id: "autobiography-of-a-yogi",
    title: "Autobiography of a Yogi",
    author: "Paramahansa Yogananda",
    bucket: "Books",
    cover: "/covers/autobiography-of-a-yogi.png",
    inProgress: true,
  },
];

/* ── SECTION HEADERS ──────────────────────────────────────── */

export const sections = {
  work: {
    eyebrow: "WORK",
    title: "Where I've spent my time",
    intro:
      "Consulting, then strategy, then product: pharma analytics, building energy, and now AI and deployment infrastructure.",
  },
  timeline: {
    eyebrow: "TIMELINE",
    title: "Sid's timeline",
    intro: "Where the work and the years line up, most recent first.",
  },
  projects: {
    eyebrow: "PROJECTS",
    title: "Things I've built",
    intro: "Products shipped inside those roles, most recent first.",
  },
  writing: {
    eyebrow: "WRITING",
    title: "Notes and essays",
    intro: "Mostly about the things I got wrong before I got them right.",
  },
  books: {
    eyebrow: "LEARNINGS",
    title: "Learnings",
    intro:
      "Sorted by what a book is about rather than when I read it, each with the one thing I still remember from it.",
  },
  ask: {
    eyebrow: "ASSISTANT",
    title: "Ask about me",
    intro:
      "A chat box wired to everything on this site. Ask it what I've worked on, what I've shipped, or whether I'm a fit for something you're hiring for.",
  },
  contact: {
    eyebrow: "CONTACT",
    title: "Let's talk",
    intro:
      "The best way to reach me, and what I'm most interested in hearing about.",
  },
} as const;
