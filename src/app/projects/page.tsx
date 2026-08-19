import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProjectFilters from "@/components/ProjectFilters";
import { PageShell, Quote, Section } from "@/components/Section";
import { projects, projectsQuote, sections } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: sections.projects.intro,
};

export default function Projects() {
  return (
    <div>
      <PageShell>
        {/* Tighter top padding than the default section rhythm, matching
            /writing: the quote is the first thing on the page and sat
            low enough to waste the fold. */}
        <Section className="pt-16 md:pt-24 lg:pt-32">
          {/* The visible header is a quote, so keep a real heading for
              screen readers and the document outline - same as /work,
              /books and /writing. */}
          <h1 className="sr-only">{sections.projects.title}</h1>

          <Quote {...projectsQuote} />

          {/* The filter bar and the list travel together - the bar owns
              which projects are visible, so it renders both. */}
          <ProjectFilters projects={projects} />
        </Section>
      </PageShell>

      <Footer />
    </div>
  );
}
