"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ViewToggle from "@/components/ViewToggle";
import { nav, profile } from "@/content/site";

/**
 * Sticky navigation pill.
 *
 * Per the spec: transparent at the very top of the page, then a
 * pill-shaped container fades in as the user scrolls. It floats over
 * content rather than pinning flush to the viewport edge.
 *
 * The pill takes the accent fill (#002fa7). Because that accent is a
 * dark saturated blue rather than the spec's pale tint, everything
 * inside it inverts once the fill appears:
 *
 *   - wordmark and links go white (10.69:1 on the accent)
 *   - the CONTACT button flips to a white fill with accent text,
 *     since an accent-on-accent button would be invisible
 *
 * At the top of the page the pill is transparent over white canvas,
 * so the same elements run in their normal ink-black / accent-filled
 * form. Both states are driven by `filled` below.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    if (!portrait) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPortrait(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [portrait]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); // account for a restored scroll position on load
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile disclosure once a link has been followed.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [open]);

  // The mobile menu forces the fill too, so its links stay legible.
  const filled = scrolled || open;

  const linkColor = filled
    ? "text-on-accent hover:text-on-accent/70"
    : "text-ink-black hover:text-smoke-gray";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-16 pt-16 sm:px-24 sm:pt-24">
      <nav
        aria-label="Primary"
        className={[
          "mx-auto flex max-w-[var(--page-max-width)] flex-wrap items-center gap-x-24 gap-y-16 rounded-nav px-24 py-12 transition-colors duration-300",
          filled ? "nav-filled bg-klein-blue" : "bg-transparent",
        ].join(" ")}
      >
        {/* Wordmark - portrait plus name. Set in title case rather than
            the lowercase logotype it used to be: next to a photograph
            of a person, a lowercase mark reads as a brand rather than
            as their name. */}
        <div className="flex items-center gap-12">
          {/* The portrait opens itself; the name goes home. They were
              one link before, and a single target cannot do both -
              clicking a photograph expecting it to enlarge and landing
              on the homepage is the more annoying of the two failures. */}
          <button
            type="button"
            onClick={() => setPortrait(true)}
            aria-label={`View ${profile.fullName}'s portrait`}
            className="shrink-0 rounded-full"
          >
            <Image
              src={profile.avatar}
              alt=""
              width={320}
              height={320}
              priority
              className="size-32 rounded-full object-cover"
            />
          </button>

          <Link href="/" className="flex items-center">
          {/* Two spans rather than one, because the swap is a
              breakpoint decision and only one is ever in the
              accessibility tree - `hidden` is display:none, so screen
              readers announce the name once, not twice.

              The swap happens at `md`, where the pill still only
              holds the wordmark, CONTACT and the menu button. */}
          <span
            className={`whitespace-nowrap text-subheading leading-subheading tracking-subheading transition-colors duration-300 md:hidden ${
              filled ? "text-on-accent" : "text-ink-black"
            }`}
          >
            {profile.shortName}
          </span>
          <span
            className={`hidden whitespace-nowrap text-subheading leading-subheading tracking-subheading transition-colors duration-300 md:inline ${
              filled ? "text-on-accent" : "text-ink-black"
            }`}
          >
            {profile.fullName}
          </span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-x-24">
          <ul className="hidden items-center gap-x-24 lg:flex">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`label transition-colors duration-300 ${linkColor}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <ViewToggle filled={filled} />

          <Link
            href="/#contact"
            className={`label rounded-button px-16 py-8 transition-colors duration-300 ${
              filled
                ? "bg-paper-white text-klein-blue hover:bg-ink-black hover:text-paper-white"
                : "bg-klein-blue text-on-accent hover:bg-ink-black"
            }`}
          >
            CONTACT
          </Link>

          {/* Disclosure menu, up to `lg`. The links and the toggle
              only fit alongside the wordmark and CONTACT from about
              1024px; below that they live in here rather than
              wrapping the pill onto a second row. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`-mr-4 flex size-32 items-center justify-center transition-colors duration-300 lg:hidden ${linkColor}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M5 5l10 10" />
                  <path d="M15 5L5 15" />
                </>
              ) : (
                <>
                  <path d="M3 6h14" />
                  <path d="M3 10h14" />
                  <path d="M3 14h14" />
                </>
              )}
            </svg>
          </button>
        </div>

        {open && (
          <ul
            id="mobile-nav"
            className="flex w-full basis-full flex-col gap-y-16 pb-8 lg:hidden"
          >
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`label ${linkColor}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* The HUMAN/AGENT switch only appears in the bar at `lg`,
                so below that the agent view would otherwise have no
                route in at all. */}
            <li className="mt-8 border-t border-paper-white/30 pt-16">
              <Link
                href="/agent"
                onClick={() => setOpen(false)}
                className={`label ${linkColor}`}
              >
                AGENT VIEW
              </Link>
            </li>
          </ul>
        )}
      </nav>

      {/* The portrait, enlarged. A dimmed backdrop rather than the
          paper-white used by the chat and product overlays: this is a
          photograph, and a white ground next to it reads as part of
          the image. Clicking anywhere closes it - there is nothing
          here to interact with, so a dedicated close button would be
          the only thing to aim at. */}
      {portrait && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${profile.fullName}, portrait`}
          onClick={() => setPortrait(false)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-black/70 p-24 backdrop-blur-sm"
        >
          <Image
            src={profile.avatar}
            alt={profile.fullName}
            width={320}
            height={320}
            /* The source is 320px square, so it is shown at its own
               size rather than blown up past it - an upscaled face is
               worse than a smaller sharp one. */
            className="size-[min(320px,80vw)] rounded-full border-4 border-paper-white object-cover"
          />
        </div>
      )}
    </header>
  );
}
