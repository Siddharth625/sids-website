"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DetailOverlay from "@/components/DetailOverlay";
import { Tag } from "@/components/Section";
import Sphere from "@/components/Sphere";
import type { Project } from "@/content/site";

/**
 * One project on /projects: screenshot on one side, the write-up on
 * the other, with Read More opening the shared overlay.
 *
 * A client component only because of that overlay - the card itself is
 * static, so everything above the button renders on the server first.
 */

function Shot({
  project,
  index,
  sizes,
  showIndex = true,
}: {
  project: Project;
  index: number;
  sizes: string;
  /** Off inside the overlay: the number counts the list, and the
      overlay is not the list. */
  showIndex?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(project.thumbnail) && !failed;
  const contain = project.thumbnailFit === "contain";

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-ink-black">
      {showImage ? (
        <Image
          src={project.thumbnail as string}
          alt={`${project.title} screenshot`}
          fill
          sizes={sizes}
          /* Contained shots get breathing room so the device edge is
             not flush against the card; cover shots must not, or the
             padding would crop into the screenshot. */
          className={contain ? "object-contain p-24" : "object-cover"}
          onError={() => setFailed(true)}
        />
      ) : (
        /* Same fail-soft rule as everywhere else: no screenshot, or a
           path with a typo, degrades to the brand sphere rather than a
           broken-image glyph. */
        <div className="absolute inset-0 flex items-center justify-center">
          <Sphere className="w-[70%] translate-y-[18%]" variant={index + 1} />
        </div>
      )}

      {showIndex && (
        <span className="label absolute left-32 top-32 text-paper-white mix-blend-difference">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const hasDetail = Boolean(project.detail?.length);

  return (
    <>
      <article className="grid items-center gap-x-56 gap-y-32 md:grid-cols-2 lg:gap-x-100">
        <Shot
          project={project}
          index={index}
          sizes="(min-width: 1024px) 520px, (min-width: 768px) 45vw, 100vw"
        />

        <div>
          {/* Dropped entirely when the year is not known, rather than
              printed as a guess. */}
          {project.year && (
            <p className="label text-smoke-gray">{project.year}</p>
          )}
          <h2 className="mt-16 text-subheading leading-subheading tracking-subheading text-ink-black sm:text-heading sm:leading-heading sm:tracking-heading">
            {project.title}
          </h2>
          <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
            {project.blurb}
          </p>

          <div className="mt-24 flex flex-wrap items-center gap-8">
            <Tag>{project.icp}</Tag>
            {project.industries.map((industry) => (
              <Tag key={industry}>{industry}</Tag>
            ))}
            {project.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>

          {(project.href || hasDetail) && (
            <div className="mt-32 flex flex-wrap items-center gap-x-24 gap-y-12">
              {project.href && (
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Visit ${project.title}`}
                  className="label link-underline text-ink-black"
                >
                  VISIT
                </Link>
              )}

              {hasDetail && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label={`Read more about ${project.title}`}
                  className="label rounded-button border border-veil-gray px-16 py-8 text-ink-black transition-colors hover:border-ink-black"
                >
                  READ MORE
                </button>
              )}
            </div>
          )}
        </div>
      </article>

      {open && (
        <DetailOverlay
          eyebrow={project.year ?? "PROJECT"}
          title={project.title}
          paragraphs={project.detail ?? []}
          href={project.href}
          onClose={() => setOpen(false)}
          aside={
            <>
              <Shot project={project} index={index} sizes="320px" showIndex={false} />
              <div className="mt-16 flex flex-wrap items-center gap-8">
                <Tag>{project.icp}</Tag>
                {project.industries.map((industry) => (
                  <Tag key={industry}>{industry}</Tag>
                ))}
                {project.skills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </>
          }
        />
      )}
    </>
  );
}
