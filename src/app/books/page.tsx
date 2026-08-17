import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { PageShell, Row, Section, SectionHeader, Tag } from "@/components/Section";
import { books, sections } from "@/content/site";

export const metadata: Metadata = {
  title: "Books",
  description: sections.books.intro,
};

const ORDER = ["READING", "FINISHED", "QUEUED"] as const;

export default function Books() {
  // Currently-reading first, then finished, then the queue.
  const sorted = [...books].sort(
    (a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status),
  );

  return (
    <>
      <PageShell>
        <Section>
          <SectionHeader
            eyebrow={sections.books.eyebrow}
            title={sections.books.title}
            intro={sections.books.intro}
          />

          <ul>
            {sorted.map((book) => (
              <Row key={book.id}>
                <div className="flex flex-col gap-x-56 gap-y-12 md:flex-row md:justify-between">
                  <div className="max-w-[560px]">
                    <h2 className="text-subheading leading-subheading tracking-subheading text-ink-black">
                      {book.title}
                    </h2>
                    <p className="label mt-12 text-smoke-gray">{book.author}</p>
                    <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                      {book.note}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-start gap-8 md:flex-col md:items-end">
                    <Tag>{book.status}</Tag>
                    {book.year && (
                      <p className="label text-smoke-gray md:mt-12">
                        {book.year}
                      </p>
                    )}
                  </div>
                </div>
              </Row>
            ))}
          </ul>
        </Section>
      </PageShell>

      <Footer />
    </>
  );
}
