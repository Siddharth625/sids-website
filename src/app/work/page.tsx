import type { Metadata } from "next";
import Footer from "@/components/Footer";
import RoleShowcase from "@/components/RoleShowcase";
import { PageShell, Quote, Section } from "@/components/Section";
import { sections, work, workQuote } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description: sections.work.intro,
};

export default function Work() {
  return (
    <div>
      <PageShell>
        <Section>
          {/* The visible header is a quote, so keep a real heading
              for screen readers and document outline. */}
          <h1 className="sr-only">{sections.work.title}</h1>
          <Quote {...workQuote} />

          {/* One card per role, most recent first, so NodeOps fills
              the first fold. Each carries its own shipped work rather
              than hiding it behind a horizontal scroll. */}
          <div className="mt-56 flex flex-col gap-40">
            {work.map((role, index) => (
              <RoleShowcase
                key={role.slug}
                role={role}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        </Section>
      </PageShell>

      <Footer />
    </div>
  );
}
