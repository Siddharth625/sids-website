import type { Metadata } from "next";
import BookShelf from "@/components/BookShelf";
import Footer from "@/components/Footer";
import { PageShell, Quote, Section } from "@/components/Section";
import { booksQuote, sections } from "@/content/site";

export const metadata: Metadata = {
  title: "Books",
  description: sections.books.intro,
};

export default function Books() {
  return (
    <div>
      <PageShell>
        <Section>
          {/* No visible header: the bucket menu already says what this
              page is, and a title above it just pushed the shelf below
              the fold. The heading is kept for the document outline
              and screen readers. */}
          <h1 className="sr-only">{sections.books.title}</h1>

          {/* The quote stands in for the page header that used to sit
              here: it says what the shelf is for without restating the
              bucket names directly underneath it. */}
          <Quote {...booksQuote} />

          <div className="mt-56">
            <BookShelf />
          </div>
        </Section>
      </PageShell>

      <Footer />
    </div>
  );
}
