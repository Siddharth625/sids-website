import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { PageShell, Section, SectionHeader, Tag } from "@/components/Section";
import Sphere from "@/components/Sphere";
import { projects, sections } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: sections.projects.intro,
};

export default function Projects() {
  return (
    <>
      <PageShell>
        <Section>
          <SectionHeader
            eyebrow={sections.projects.eyebrow}
            title={sections.projects.title}
            intro={sections.projects.intro}
          />

          <div className="flex flex-col gap-y-56 md:gap-y-100">
            {projects.map((project, i) => (
              <article
                key={project.title}
                className="grid items-center gap-x-56 gap-y-32 md:grid-cols-2 lg:gap-x-100"
              >
                {/* Feature image card — 44px radius, no shadow, the
                    same gradient substance as the brand sphere. */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-ink-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sphere
                      className="w-[70%] translate-y-[18%]"
                      variant={i + 1}
                    />
                  </div>
                  <span className="label absolute left-32 top-32 text-paper-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <p className="label text-smoke-gray">{project.year}</p>
                  <h2 className="mt-16 text-subheading leading-subheading tracking-subheading text-ink-black sm:text-heading sm:leading-heading sm:tracking-heading">
                    {project.title}
                  </h2>
                  <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                    {project.blurb}
                  </p>

                  <div className="mt-24 flex flex-wrap items-center gap-8">
                    {project.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>

                  {project.href && (
                    <Link
                      href={project.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="label link-underline mt-32 inline-block text-ink-black"
                    >
                      VIEW PROJECT
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>
      </PageShell>

      <Footer />
    </>
  );
}
