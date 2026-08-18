import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PostRow from "@/components/PostRow";
import { PageShell, Section, SectionHeader } from "@/components/Section";
import { posts, sections } from "@/content/site";

export const metadata: Metadata = {
  title: "Writing",
  description: sections.writing.intro,
};

export default function Writing() {
  return (
    <div>
      <PageShell>
        <Section>
          <SectionHeader
            eyebrow={sections.writing.eyebrow}
            title={sections.writing.title}
            intro={sections.writing.intro}
          />

          <ul>
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
