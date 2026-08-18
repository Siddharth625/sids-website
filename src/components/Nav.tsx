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
        <Link href="/" className="flex items-center gap-12">
          <Image
            src={profile.avatar}
            alt=""
            width={320}
            height={320}
            priority
            className="size-32 shrink-0 rounded-full object-cover"
          />
          <span
            className={`whitespace-nowrap text-subheading leading-subheading tracking-subheading transition-colors duration-300 ${
              filled ? "text-on-accent" : "text-ink-black"
            }`}
          >
            {profile.fullName}
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-x-24">
          <ul className="hidden items-center gap-x-24 md:flex">
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

          {/* Mobile disclosure - the pill grows downward rather than
              opening an overlay, keeping the single-surface feel. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className={`label transition-colors duration-300 md:hidden ${linkColor}`}
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>

        {open && (
          <ul
            id="mobile-nav"
            className="flex w-full basis-full flex-col gap-y-16 pb-8 md:hidden"
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
          </ul>
        )}
      </nav>
    </header>
  );
}
