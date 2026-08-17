import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { PageShell, Section, SectionHeader, Tag } from "@/components/Section";
import { knowledge, sections } from "@/content/site";

export const metadata: Metadata = {
  title: "Knowledge Bank",
  description: sections.knowledge.intro,
};

export default function Knowledge() {
  return (
    <>
      <PageShell>
        <Section>
          <SectionHeader
            eyebrow={sections.knowledge.eyebrow}
            title={sections.knowledge.title}
            intro={sections.knowledge.intro}
          />

          <div className="grid gap-x-56 gap-y-40 md:grid-cols-2">
            {knowledge.map((entry) => (
              <article
                key={entry.title}
                className="flex flex-col rounded-card border border-veil-gray p-32"
              >
                <Tag>{entry.tag}</Tag>

                <h2 className="mt-24 text-subheading leading-subheading tracking-subheading text-ink-black">
                  {entry.title}
                </h2>

                <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                  {entry.body}
                </p>

                {entry.href && (
                  <Link
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label link-underline mt-24 inline-block self-start text-ink-black"
                  >
                    SOURCE
                  </Link>
                )}
              </article>
            ))}
          </div>
        </Section>
      </PageShell>

      <Footer />
    </>
  );
}
