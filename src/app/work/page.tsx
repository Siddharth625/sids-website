import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { PageShell, Row, Section, SectionHeader } from "@/components/Section";
import { sections, work } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description: sections.work.intro,
};

export default function Work() {
  return (
    <>
      <PageShell>
        <Section>
          <SectionHeader
            eyebrow={sections.work.eyebrow}
            title={sections.work.title}
            intro={sections.work.intro}
          />

          <ul>
            {work.map((role) => (
              <Row key={`${role.company}-${role.period}`}>
                <div className="flex flex-col gap-x-56 gap-y-16 md:flex-row md:justify-between">
                  <div className="max-w-[560px]">
                    <h2 className="label text-ink-black">
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
                    </h2>
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
      </PageShell>

      <Footer />
    </>
  );
}
