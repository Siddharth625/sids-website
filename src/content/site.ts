/* ─────────────────────────────────────────────────────────────
   ALL SITE COPY LIVES HERE.
   Every string the visitor reads is in this file — no copy is
   hardcoded in components. Placeholders are written in CAPS so
   they're impossible to miss. Replace them and the whole site
   updates.
   ───────────────────────────────────────────────────────────── */

export const profile = {
  // TODO: replace with your full name
  name: "Sid",
  // TODO: your actual title
  role: "ENGINEER",
  location: "YOUR CITY",

  /* Hero. Kept short — it's set at 50px with -0.5px tracking and
     centered, so anything past ~9 words wraps past three lines. */
  headline: "Building infrastructure that gets out of the way.",
  // The subhead is doing the job of an About section.
  subhead:
    "ONE-SENTENCE BIO — what you work on, who you work on it for, and why it matters. Two lines at most.",

  email: "sid@nodeops.xyz",
} as const;

export const socials = [
  { label: "GITHUB", href: "https://github.com/YOUR-HANDLE" },
  { label: "X", href: "https://x.com/YOUR-HANDLE" },
  { label: "LINKEDIN", href: "https://linkedin.com/in/YOUR-HANDLE" },
  { label: "EMAIL", href: `mailto:${profile.email}` },
] as const;

export const nav = [
  { label: "WORK", href: "/#work" },
  { label: "PROJECTS", href: "/#projects" },
  { label: "WRITING", href: "/#writing" },
  { label: "LIBRARY", href: "/#library" },
] as const;

/* ── WORK ─────────────────────────────────────────────────── */

export type Role = {
  company: string;
  role: string;
  period: string;
  blurb: string;
  href?: string;
};

export const work: Role[] = [
  {
    company: "NODEOPS",
    role: "YOUR ROLE",
    period: "2024 — PRESENT",
    blurb:
      "What you own here, in one or two sentences. Lead with the outcome, not the job description — what changed because you were the one doing it.",
    href: "https://nodeops.xyz",
  },
  {
    company: "PREVIOUS COMPANY",
    role: "YOUR ROLE",
    period: "2022 — 2024",
    blurb:
      "The problem you were brought in to solve, and where it landed. Numbers land harder than adjectives here.",
  },
  {
    company: "EARLIER COMPANY",
    role: "YOUR ROLE",
    period: "2020 — 2022",
    blurb:
      "Keep the oldest entries shortest — a single line is enough once the work is a few years back.",
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

export const projects: Project[] = [
  {
    title: "Project One",
    blurb:
      "What it does and who it's for, in a sentence. The second sentence should say what was genuinely hard about it — that's the part people remember.",
    tags: ["TYPESCRIPT", "RUST"],
    href: "https://github.com/YOUR-HANDLE/project-one",
    year: "2025",
  },
  {
    title: "Project Two",
    blurb:
      "A short description of the thing you built, why it exists, and what it replaced.",
    tags: ["GO", "KUBERNETES"],
    href: "https://github.com/YOUR-HANDLE/project-two",
    year: "2024",
  },
  {
    title: "Project Three",
    blurb:
      "Side projects count. So do the ones that failed, if you learned something worth writing down.",
    tags: ["PYTHON"],
    year: "2023",
  },
];

/* ── WRITING ──────────────────────────────────────────────── */

export type Post = {
  title: string;
  date: string; // ISO — formatted for display at render time
  blurb: string;
  href: string;
  readingTime: string;
};

export const posts: Post[] = [
  {
    title: "The title of your most recent piece",
    date: "2026-07-14",
    blurb:
      "A one-line standfirst. Say the argument, not the topic — 'why X is wrong about Y' beats 'thoughts on Y'.",
    href: "/writing/post-slug",
    readingTime: "6 MIN",
  },
  {
    title: "Something you figured out the hard way",
    date: "2026-05-02",
    blurb:
      "The best personal-site posts are the ones you'd have wanted to find when you were stuck.",
    href: "/writing/post-slug-2",
    readingTime: "11 MIN",
  },
  {
    title: "A shorter note",
    date: "2026-02-20",
    blurb: "Not everything needs to be an essay.",
    href: "/writing/post-slug-3",
    readingTime: "3 MIN",
  },
  {
    title: "An older piece worth keeping",
    date: "2025-11-08",
    blurb: "Older writing you still stand behind.",
    href: "/writing/post-slug-4",
    readingTime: "8 MIN",
  },
];

/* ── INTERESTS ────────────────────────────────────────────── */

export type Interest = {
  title: string;
  body: string;
};

export const interests: Interest[] = [
  {
    title: "First interest",
    body: "A couple of sentences on what pulls you in about this. Specific beats broad — 'the failure modes of consensus protocols' is a personality, 'distributed systems' is a resume line.",
  },
  {
    title: "Second interest",
    body: "Something outside work. This section is the one that makes a personal site personal, so resist making all three of them technical.",
  },
  {
    title: "Third interest",
    body: "What you'd talk about for an hour without checking the time.",
  },
];

/* ── BOOKS ────────────────────────────────────────────────── */

export type Book = {
  /* Stable unique key. Title+author isn't reliable — you can read two
     editions of the same book, or reread one across years. */
  id: string;
  title: string;
  author: string;
  note: string;
  status: "READING" | "FINISHED" | "QUEUED";
  year?: string;
};

export const books: Book[] = [
  {
    id: "book-1",
    title: "BOOK TITLE",
    author: "AUTHOR NAME",
    note: "One line on what it changed for you. Not a summary — a reaction.",
    status: "READING",
  },
  {
    id: "book-2",
    title: "BOOK TITLE",
    author: "AUTHOR NAME",
    note: "The note is the whole point of a books page. A bare list of titles says nothing.",
    status: "FINISHED",
    year: "2026",
  },
  {
    id: "book-3",
    title: "BOOK TITLE",
    author: "AUTHOR NAME",
    note: "Books you disliked are more interesting than books you liked. Say why.",
    status: "FINISHED",
    year: "2025",
  },
  {
    id: "book-4",
    title: "BOOK TITLE",
    author: "AUTHOR NAME",
    note: "What made you pick it up.",
    status: "QUEUED",
  },
];

/* ── KNOWLEDGE BANK ───────────────────────────────────────── */

export type Entry = {
  title: string;
  body: string;
  tag: string;
  href?: string;
};

export const knowledge: Entry[] = [
  {
    title: "A thing worth remembering",
    body: "The knowledge bank is for durable notes — the stuff you keep re-deriving because you never wrote it down. Each entry should be useful to a stranger, not just to you.",
    tag: "SYSTEMS",
  },
  {
    title: "A reference you keep returning to",
    body: "Link out generously here. Curation is a real contribution.",
    tag: "REFERENCE",
    href: "https://example.com",
  },
  {
    title: "A mental model",
    body: "Frameworks you use to make decisions, and where they break down.",
    tag: "THINKING",
  },
  {
    title: "A hard-won operational lesson",
    body: "Incidents, postmortems, and the rules you now follow because of them.",
    tag: "OPS",
  },
];

/* ── SECTION HEADERS ──────────────────────────────────────── */

export const sections = {
  work: {
    eyebrow: "WORK",
    title: "Where I've spent my time",
    intro:
      "A short framing line for the section. What ties these roles together?",
  },
  projects: {
    eyebrow: "PROJECTS",
    title: "Things I've built",
    intro: "Selected work, most recent first.",
  },
  writing: {
    eyebrow: "WRITING",
    title: "Notes and essays",
    intro: "Mostly about the things I got wrong before I got them right.",
  },
  interests: {
    eyebrow: "INTERESTS",
    title: "What holds my attention",
    intro: "The topics I keep circling back to.",
  },
  books: {
    eyebrow: "BOOKS",
    title: "What I'm reading",
    intro: "A running shelf, with notes.",
  },
  knowledge: {
    eyebrow: "KNOWLEDGE BANK",
    title: "Things worth keeping",
    intro:
      "A working set of notes, references, and models I've found worth writing down.",
  },
  contact: {
    eyebrow: "CONTACT",
    title: "Let's talk",
    intro:
      "The best way to reach me, and what I'm most interested in hearing about.",
  },
} as const;
