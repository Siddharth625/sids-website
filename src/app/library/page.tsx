import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  PageHeader,
  PageShell,
  Row,
  Section,
  SectionHeader,
  Tag,
} from "@/components/Section";
import { books, interests, knowledge, sections } from "@/content/site";

export const metadata: Metadata = {
  title: "Library",
  description: sections.library.intro,
};

/**
 * Hub for the three "input" collections. Interests live here in full;
 * Books and the Knowledge Bank show a few entries each and hand off to
 * their own pages, which is where they grow.
 */
export default function Library() {
  return (
    <>
      <PageShell>
        <PageHeader
          eyebrow={sections.library.eyebrow}
          title={sections.library.title}
          intro={sections.library.intro}
        />

        {/* Interests — shown in full; there is no deeper page. */}
        <Section>
          <SectionHeader
            eyebrow={sections.interests.eyebrow}
            title={sections.interests.title}
            intro={sections.interests.intro}
          />

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

        {/* Books — preview, full shelf at /books */}
        <Section>
          <SectionHeader
            eyebrow={sections.books.eyebrow}
            title={sections.books.title}
            intro={sections.books.intro}
          />

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

        {/* Knowledge Bank — preview, all entries at /knowledge */}
        <Section>
          <SectionHeader
            eyebrow={sections.knowledge.eyebrow}
            title={sections.knowledge.title}
            intro={sections.knowledge.intro}
          />

          <div className="grid gap-x-56 gap-y-40 md:grid-cols-2">
            {knowledge.slice(0, 2).map((entry) => (
              <article
                key={entry.title}
                className="flex flex-col rounded-card border border-veil-gray p-32"
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
      </PageShell>

      <Footer />
    </>
  );
}
