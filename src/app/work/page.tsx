import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { PageShell, Quote, Section } from "@/components/Section";
import WorkCarousel from "@/components/WorkCarousel";
import { sections, workQuote } from "@/content/site";

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

          <div className="mt-56">
            <WorkCarousel />
          </div>
        </Section>
      </PageShell>

      <Footer />
    </div>
  );
}
