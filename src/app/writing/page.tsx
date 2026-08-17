import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Row, Section, SectionHeader } from "@/components/Section";
import { posts, sections } from "@/content/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Writing",
  description: sections.writing.intro,
};

export default function Writing() {
  return (
    <>
      {/* Clears the fixed nav pill. Kept on a wrapper rather than
          passed into <Section>, where it would collide with the
          section's own responsive vertical padding. */}
      <div className="pt-100 lg:pt-[120px]">
        <Section>
          <SectionHeader
            eyebrow={sections.writing.eyebrow}
            title={sections.writing.title}
            intro={sections.writing.intro}
          />

          <ul>
            {posts.map((post) => (
              <Row key={post.href}>
                <Link href={post.href} className="group block">
                  <div className="flex flex-col gap-x-56 gap-y-12 md:flex-row md:items-baseline md:justify-between">
                    <h2 className="max-w-[560px] text-subheading leading-subheading tracking-subheading text-ink-black transition-colors duration-200 group-hover:text-smoke-gray">
                      {post.title}
                    </h2>
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
        </Section>
      </div>

      <Footer />
    </>
  );
}
