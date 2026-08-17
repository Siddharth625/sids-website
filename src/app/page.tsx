import Link from "next/link";
import Footer from "@/components/Footer";
import { Row, Section, SectionHeader, Tag } from "@/components/Section";
import Sphere from "@/components/Sphere";
import {
  books,
  interests,
  knowledge,
  posts,
  profile,
  projects,
  sections,
  work,
} from "@/content/site";
import { formatDate } from "@/lib/format";

export default function Home() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────
          The only centred content on the site. Everything below
          this point is left-aligned, per the spec. */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-24 pb-[38svh] pt-100">
        <div className="relative z-10 flex max-w-[840px] flex-col items-center text-center">
          <p className="label text-smoke-gray">
            {profile.role} — {profile.location}
          </p>

          <h1 className="mt-32 text-[34px] leading-display tracking-display text-ink-black sm:text-[42px] lg:text-display">
            {profile.headline}
          </h1>

          <p className="mt-24 max-w-[560px] text-body leading-body tracking-body text-mist-gray sm:text-subheading sm:leading-subheading sm:tracking-subheading">
            {profile.subhead}
          </p>
        </div>

        {/* The sphere rises from the bottom of the viewport like a
            planet. Clipped by the section's overflow-hidden so only
            the upper arc shows. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-[52%] justify-center">
          <Sphere className="w-[min(620px,115vw)]" />
        </div>
      </section>

      {/* ── WORK ───────────────────────────────────────────────── */}
      <Section id="work">
        <SectionHeader {...sections.work} />

        <ul>
          {work.map((role) => (
            <Row key={`${role.company}-${role.period}`}>
              <div className="flex flex-col gap-x-56 gap-y-16 md:flex-row md:justify-between">
                <div className="max-w-[560px]">
                  <h3 className="label text-ink-black">
                    {role.href ? (
                      <Link
                        href={role.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link-underline"
                      >
                        {role.company}
                      </Link>
                    ) : (
                      role.company
                    )}
                  </h3>
                  <p className="mt-12 text-subheading leading-subheading tracking-subheading text-ink-black">
                    {role.role}
                  </p>
                  <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                    {role.blurb}
                  </p>
                </div>
                <p className="label shrink-0 text-smoke-gray md:text-right">
                  {role.period}
                </p>
              </div>
            </Row>
          ))}
        </ul>
      </Section>

      {/* ── PROJECTS ────────────────────────────────────────────
          The two-column feature pattern: image card left, text
          right, repeating down the page. */}
      <Section id="projects">
        <SectionHeader {...sections.projects} />

        <div className="flex flex-col gap-y-56 md:gap-y-100">
          {projects.map((project, i) => (
            <article
              key={project.title}
              className="grid items-center gap-x-56 gap-y-32 md:grid-cols-2 lg:gap-x-100"
            >
              {/* Feature image card — 44px radius, no shadow, the
                  same gradient substance as the hero sphere. */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-ink-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sphere
                    className="w-[70%] translate-y-[18%]"
                    variant={i + 1}
                  />
                </div>
                <span className="label absolute left-32 top-32 text-paper-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <p className="label text-smoke-gray">{project.year}</p>
                <h3 className="mt-16 text-subheading leading-subheading tracking-subheading text-ink-black sm:text-heading sm:leading-heading sm:tracking-heading">
                  {project.title}
                </h3>
                <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                  {project.blurb}
                </p>

                <div className="mt-24 flex flex-wrap items-center gap-8">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>

                {project.href && (
                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label link-underline mt-32 inline-block text-ink-black"
                  >
                    VIEW PROJECT
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ── WRITING ─────────────────────────────────────────────
          Three most recent on the homepage; the full archive lives
          at /writing so this section can't grow unbounded. */}
      <Section id="writing">
        <SectionHeader {...sections.writing} />

        <ul>
          {posts.slice(0, 3).map((post) => (
            <Row key={post.href}>
              <Link href={post.href} className="group block">
                <div className="flex flex-col gap-x-56 gap-y-12 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="max-w-[560px] text-subheading leading-subheading tracking-subheading text-ink-black transition-colors duration-200 group-hover:text-smoke-gray">
                    {post.title}
                  </h3>
                  <p className="label shrink-0 text-smoke-gray md:text-right">
                    {formatDate(post.date)} — {post.readingTime}
                  </p>
                </div>
                <p className="mt-16 max-w-[560px] text-body leading-body tracking-body text-mist-gray">
                  {post.blurb}
                </p>
              </Link>
            </Row>
          ))}
        </ul>

        <Link
          href="/writing"
          className="label link-underline mt-56 inline-block text-ink-black"
        >
          ALL WRITING
        </Link>
      </Section>

      {/* ── LIBRARY ─────────────────────────────────────────────
          Interests, Books and the Knowledge Bank are all "inputs" —
          grouped under one anchor so the nav stays at four items. */}
      <div id="library">
        {/* Interests */}
        <Section>
          <SectionHeader {...sections.interests} />

          <div className="grid gap-x-56 gap-y-40 md:grid-cols-3">
            {interests.map((interest) => (
              <article key={interest.title}>
                <h3 className="text-subheading leading-subheading tracking-subheading text-ink-black">
                  {interest.title}
                </h3>
                <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                  {interest.body}
                </p>
              </article>
            ))}
          </div>
        </Section>

        {/* Books */}
        <Section>
          <SectionHeader {...sections.books} />

          <ul>
            {books.slice(0, 3).map((book) => (
              <Row key={book.id}>
                <div className="flex flex-col gap-x-56 gap-y-12 md:flex-row md:justify-between">
                  <div className="max-w-[560px]">
                    <h3 className="text-subheading leading-subheading tracking-subheading text-ink-black">
                      {book.title}
                    </h3>
                    <p className="label mt-12 text-smoke-gray">{book.author}</p>
                    <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                      {book.note}
                    </p>
                  </div>
                  <div className="shrink-0 md:text-right">
                    <Tag>{book.status}</Tag>
                  </div>
                </div>
              </Row>
            ))}
          </ul>

          <Link
            href="/books"
            className="label link-underline mt-56 inline-block text-ink-black"
          >
            FULL SHELF
          </Link>
        </Section>

        {/* Knowledge Bank */}
        <Section>
          <SectionHeader {...sections.knowledge} />

          <div className="grid gap-x-56 gap-y-40 md:grid-cols-2">
            {knowledge.slice(0, 2).map((entry) => (
              <article
                key={entry.title}
                className="rounded-card border border-veil-gray p-32"
              >
                <Tag>{entry.tag}</Tag>
                <h3 className="mt-24 text-subheading leading-subheading tracking-subheading text-ink-black">
                  {entry.title}
                </h3>
                <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                  {entry.body}
                </p>
              </article>
            ))}
          </div>

          <Link
            href="/knowledge"
            className="label link-underline mt-56 inline-block text-ink-black"
          >
            BROWSE THE BANK
          </Link>
        </Section>
      </div>

      <Footer />
    </>
  );
}
