import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PostRow from "@/components/PostRow";
import { PageShell, Quote, Section } from "@/components/Section";
import { posts, sections, writingQuote } from "@/content/site";

export const metadata: Metadata = {
  title: "Writing",
  description: sections.writing.intro,
};

export default function Writing() {
  return (
    <div>
      <PageShell>
        {/* Tighter top padding than the default section rhythm: the
            quote is the first thing on the page, and at the standard
            py-40/56/80 it sat low enough to waste the fold. */}
        <Section className="pt-16 md:pt-24 lg:pt-32">
          {/* The visible header is a quote, so keep a real heading for
              screen readers and the document outline - same as /work
              and /books. */}
          <h1 className="sr-only">{sections.writing.title}</h1>

          {/* Stands in for the page header that used to sit here. The
              posts below carry their own titles and summaries, so a
              second description of the page was only pushing the first
              post down. */}
          <Quote {...writingQuote} />

          <ul className="mt-56">
            {posts.map((post, i) => (
              <PostRow key={post.href} post={post} index={i} headingLevel="h2" />
            ))}
          </ul>
        </Section>
      </PageShell>

      <Footer />
    </div>
  );
}
