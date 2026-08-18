"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImpactPill } from "@/components/Section";
import { work } from "@/content/site";

/**
 * Horizontal carousel of roles with a scroll-position indicator.
 *
 * Built on native scroll with CSS scroll-snap rather than a JS slider:
 * it keeps trackpad, touch, keyboard and scrollbar interaction working
 * for free, and the arrows are a convenience on top rather than the
 * only way through. The progress bar reflects real scroll position, so
 * it stays truthful during a flick or a drag, not just on arrow clicks.
 */
export default function WorkCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const cards = Array.from(el.children) as HTMLElement[];
    if (cards.length === 0) return;

    const trackRect = el.getBoundingClientRect();
    const max = el.scrollWidth - el.clientWidth;

    /* The track's first snap point is its padding edge, not 0 - so a
       freshly loaded carousel sits at scrollLeft ≈ 40. Measuring that
       offset keeps progress starting at zero and PREV disabled. */
    const min =
      cards[0].getBoundingClientRect().left - trackRect.left + el.scrollLeft;

    const span = max - min;
    setProgress(span <= 1 ? 1 : (el.scrollLeft - min) / span);

    /* Active card = whichever centre is nearest the track's centre.
       Dividing scrollLeft by card width looks equivalent but breaks at
       the end: the last card can't reach its own snap point when the
       remaining scroll is shorter than a card, so the counter would
       stop one short and never show the final entry. */
    const centre = trackRect.left + trackRect.width / 2;
    let nearest = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - centre);
      if (dist < bestDist) {
        bestDist = dist;
        nearest = i;
      }
    });

    setActive(nearest);
    setAtStart(nearest === 0);
    setAtEnd(nearest === cards.length - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const delta = (card ? card.offsetWidth + 32 : el.clientWidth) * dir;
    el.scrollBy({
      left: delta,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <div>
      <ul
        ref={trackRef}
        /* Negative margin + padding lets cards bleed to the viewport
           edge while still lining up with the container on the left. */
        className="no-scrollbar -mx-24 flex snap-x snap-mandatory gap-32 overflow-x-auto px-24 pb-8 sm:-mx-40 sm:px-40"
        tabIndex={0}
        aria-label="Roles"
      >
        {work.map((role) => (
          <li
            key={`${role.company}-${role.period}`}
            className="w-[min(86vw,620px)] shrink-0 snap-start"
          >
            <article className="flex h-full flex-col rounded-card border border-veil-gray p-32">
              <div className="flex items-center gap-16">
                {role.logo && (
                  <div className="size-[48px] shrink-0 overflow-hidden rounded-2xl bg-ink-black">
                    <Image
                      src={role.logo}
                      alt=""
                      width={256}
                      height={256}
                      className="size-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
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
                  <p className="label mt-4 text-smoke-gray">{role.period}</p>
                </div>
              </div>

              {role.context && (
                <p className="label mt-24 text-smoke-gray">{role.context}</p>
              )}

              <p className="mt-12 text-subheading leading-subheading tracking-subheading text-ink-black">
                {role.role}
              </p>

              <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                {role.blurb}
              </p>

              {role.impact && (
                <ul className="mt-24 flex flex-wrap gap-8">
                  {role.impact.map((item) => (
                    <li key={item.metric}>
                      <ImpactPill>{item.metric}</ImpactPill>
                    </li>
                  ))}
                </ul>
              )}

              {role.highlights && (
                <ul className="mt-24 flex flex-col gap-12">
                  {role.highlights.map((point) => (
                    <li key={point} className="flex gap-12">
                      <span
                        aria-hidden="true"
                        className="mt-8 block size-4 shrink-0 rounded-full bg-veil-gray"
                      />
                      <span className="text-body leading-body tracking-body text-mist-gray">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ul>

      {/* Position indicator + controls */}
      <div className="mt-32 flex items-center gap-24">
        <div
          className="h-4 flex-1 overflow-hidden rounded-full bg-veil-gray"
          role="progressbar"
          aria-label="Scroll position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full rounded-full bg-klein-blue transition-[width] duration-150"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>

        <p className="label shrink-0 tabular-nums text-smoke-gray">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(work.length).padStart(2, "0")}
        </p>

        <div className="flex shrink-0 items-center gap-8">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Previous role"
            className="label rounded-full border border-veil-gray px-16 py-8 text-ink-black transition-opacity disabled:opacity-30"
          >
            PREV
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label="Next role"
            className="label rounded-full border border-veil-gray px-16 py-8 text-ink-black transition-opacity disabled:opacity-30"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
