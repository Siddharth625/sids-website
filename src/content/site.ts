/* ─────────────────────────────────────────────────────────────
   ALL SITE COPY LIVES HERE.
   Every string the visitor reads is in this file — no copy is
   hardcoded in components. Placeholders are written in CAPS so
   they're impossible to miss. Replace them and the whole site
   updates.
   ───────────────────────────────────────────────────────────── */

export const profile = {
  /* Drives the nav wordmark (lowercased there, as a logotype), the
     hero H1, the page title and the footer copyright. */
  fullName: "Siddharth Chadha",

  role: "AI Product Manager",
  // Still used in the footer copyright line.
  location: "YOUR CITY",

  /* The hero H1. */
  headline: "First principles over precedent. Signal over noise.",

  /* Sits under the headline, doing the job of an About section.
     Rendered at body size, not subheading — at 20px a paragraph this
     long turns into a wall on a half-width column. */
  bio: "Five years across consulting, strategy and product, now building AI products where the hard part isn't the model, it's deciding what's worth building. Reached this work through data and analytics, which is why the instinct is always to check the number before the narrative. Comfortable at the front of a problem: the stage where there's no roadmap, no benchmark, and the job is to establish what's actually true.",

  /* Meta description only. Kept separate from `bio` because search
     results truncate around 155 characters. */
  description:
    "Siddharth Chadha — AI product manager and 0→1 builder. First principles over precedent. Signal over noise.",

  /* Square portrait in /public, cropped around the face. Used only by
     the nav wordmark, where it renders as a small circle. */
  avatar: "/portrait.jpg",

  email: "sid@nodeops.xyz",
} as const;

/* ── COMPANIES & CLIENTS ──────────────────────────────────────
   Logo strip below the hero.

   Drop an SVG or PNG into /public/logos and set `logo` to its path.
   Until then each entry falls back to its name as a wordmark, so the
   strip looks deliberate rather than broken. Monochrome logos work
   best — the strip is rendered greyscale to stay inside the
   near-achromatic palette. */

export type Client = {
  name: string;
  logo?: string;
};

/* Not `as const`: that narrows each entry to exactly the keys written
   here, so adding `logo` later would stop type-checking. */
export const clients: { title: string; items: Client[] } = {
  title: "Notable companies & clients worked with",
  items: [
    { name: "Deloitte" },
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
   leaves its near-monochrome palette — the colour is confined to an
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

export const socials = [
  { label: "GITHUB", href: "https://github.com/YOUR-HANDLE" },
  { label: "X", href: "https://x.com/YOUR-HANDLE" },
  { label: "LINKEDIN", href: "https://linkedin.com/in/YOUR-HANDLE" },
  { label: "EMAIL", href: `mailto:${profile.email}` },
] as const;

export const nav = [
  { label: "WORK", href: "/work" },
  { label: "PROJECTS", href: "/projects" },
  { label: "WRITING", href: "/writing" },
  { label: "LIBRARY", href: "/library" },
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
  /* The /library hub. Interests, Books and the Knowledge Bank are all
     "inputs" — grouped so the nav stays at four items. */
  library: {
    eyebrow: "LIBRARY",
    title: "What goes in",
    intro:
      "The reading, notes and preoccupations behind everything on the rest of this site.",
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
