"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AskChat from "@/components/AskChat";
import { assistant } from "@/content/site";

/**
 * Arthur, as a sticky launcher in the bottom-left corner.
 *
 * Bottom-right, the conventional corner for this - far enough below
 * the nav's CONTACT button that the two never read as one control.
 *
 * It renders the same `AskChat` the homepage section does, so the
 * question allowance and the transcript are shared - both read the
 * same `sessionStorage` keys. The panel remounts on open, which is
 * what re-reads that state, so a conversation started in the section
 * continues here rather than starting over.
 *
 * Hidden on the homepage while the section itself is on screen: two
 * live chats visible at once would be two React states writing the
 * same storage keys, and the visitor would watch them disagree.
 */
export default function AskLauncher() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  /* Close on route change - a chat panel that survives navigation
     covers the page the visitor just asked for. */
  useEffect(() => setOpen(false), [pathname]);

  /* Stand down while the homepage's own assistant section is in view. */
  useEffect(() => {
    const section = document.getElementById("ask");
    if (!section) {
      setHidden(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  /* Escape closes, and focus moves into the panel when it opens. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("textarea")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (hidden && !open) return null;

  return (
    <>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={`Chat with ${assistant.name}`}
          className="fixed bottom-[96px] right-16 z-50 flex max-h-[min(560px,70svh)] w-[min(calc(100vw-32px),400px)] flex-col overflow-hidden rounded-3xl border border-veil-gray bg-paper-white sm:right-24"
        >
          <AskChat showContext={false} onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? `Close ${assistant.name}` : `Ask ${assistant.name}`}
        /* A circle holding Arthur's face and nothing else. The name
           lives in `aria-label` and the tooltip rather than beside the
           avatar, so the control stays the same size in every language
           and never crowds the corner on a phone. */
        title={open ? `Close ${assistant.name}` : `Ask ${assistant.name}`}
        className="fixed bottom-24 right-16 z-50 flex size-[56px] items-center justify-center overflow-hidden rounded-full border border-veil-gray bg-paper-white transition-colors hover:border-ink-black sm:right-24"
      >
        {open ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="text-ink-black"
          >
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        ) : (
          <Image
            src={assistant.avatar}
            alt=""
            width={296}
            height={296}
            className="size-full object-cover"
          />
        )}
      </button>
    </>
  );
}
