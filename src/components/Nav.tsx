"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, profile } from "@/content/site";

/**
 * Sticky navigation pill.
 *
 * Per the spec: transparent at the very top of the page, then a
 * pill-shaped container fades in as the user scrolls. It floats over
 * content rather than pinning flush to the viewport edge.
 *
 * The periwinkle fill and the single filled button are the only two
 * places colour appears anywhere in the system.
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-16 pt-16 sm:px-24 sm:pt-24">
      <nav
        aria-label="Primary"
        className={[
          "mx-auto flex max-w-[var(--page-max-width)] flex-wrap items-center gap-x-24 gap-y-16 rounded-nav px-24 py-12 transition-colors duration-300",
          scrolled || open
            ? "bg-periwinkle-glow"
            : "bg-transparent",
        ].join(" ")}
      >
        {/* Wordmark — lowercase, the one piece of custom lettering */}
        <Link
          href="/"
          className="text-subheading leading-subheading tracking-subheading text-ink-black lowercase"
        >
          {profile.name.toLowerCase()}
        </Link>

        <div className="ml-auto flex items-center gap-x-24">
          <ul className="hidden items-center gap-x-24 md:flex">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="label text-ink-black transition-colors duration-200 hover:text-smoke-gray"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/#contact"
            className="label rounded-button bg-periwinkle-glow px-16 py-8 text-ink-black transition-colors duration-200 hover:bg-ink-black hover:text-paper-white"
          >
            CONTACT
          </Link>

          {/* Mobile disclosure — the pill grows downward rather than
              opening an overlay, keeping the single-surface feel. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="label text-ink-black md:hidden"
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
                  className="label text-ink-black"
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
