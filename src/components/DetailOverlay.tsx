"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";

/**
 * The Read More surface, shared by the role cards on /work and the
 * project cards on /projects.
 *
 * It is a full-screen overlay rather than a route. Both callers open it
 * from inside a list the visitor is part-way through - a role card they
 * expanded, a project they scrolled to - and a route change loses that
 * position on the way back. The overlay keeps the page underneath
 * exactly where it was.
 *
 * Everything specific to the caller arrives as props: the body copy,
 * the outbound link, and whatever belongs in the sidebar (a screenshot
 * plus facts for a product, a screenshot plus tags for a project).
 */
export default function DetailOverlay({
  eyebrow,
  title,
  paragraphs,
  href,
  linkLabel,
  aside,
  onClose,
}: {
  eyebrow: ReactNode;
  title: string;
  paragraphs: readonly string[];
  href?: string;
  linkLabel?: string;
  aside?: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    /* Hold the page behind still. Restoring the previous value rather
       than clearing it matters when something else already locked the
       scroll - the chat launcher does this too. */
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} in detail`}
      className="fixed inset-0 z-[60] overflow-y-auto bg-paper-white"
    >
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-24 pb-56 pt-24 sm:px-40">
        <div className="flex items-start justify-between gap-24">
          <div className="min-w-0">
            <p className="label text-smoke-gray">{eyebrow}</p>
            <h2 className="mt-12 text-[24px] leading-heading tracking-heading text-ink-black sm:text-heading">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="label link-underline shrink-0 text-ink-black"
          >
            CLOSE
          </button>
        </div>

        <div className="mt-40 grid gap-40 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-24">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="max-w-[680px] text-body leading-body tracking-body text-ink-black"
              >
                {paragraph}
              </p>
            ))}

            {href && (
              <Link
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="label link-underline self-start text-ink-black"
              >
                {linkLabel ?? `VISIT ${title.toUpperCase()}`}
              </Link>
            )}
          </div>

          {aside && <div className="lg:sticky lg:top-24 lg:self-start">{aside}</div>}
        </div>
      </div>
    </div>
  );
}
