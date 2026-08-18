"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AskChat from "@/components/AskChat";
import { assistant } from "@/content/site";
import { capture, EVENTS } from "@/lib/analytics";

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

  /* Lock the page behind the sheet. Without this, scrolling inside
     the transcript hands off to the document once it reaches its end
     and the page creeps underneath. Restores whatever `overflow` was
     there before rather than assuming it was the default. */
  useEffect(() => {
    if (!open) return;
    const mobile = window.matchMedia("(max-width: 639px)");
    if (!mobile.matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

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
          /* Mobile-first: a full-screen sheet, so the page behind is
             covered rather than showing through around the edges of a
             floating card on a 390px screen. From `sm` up it becomes
             the corner panel. Written in this order deliberately - the
             mobile rules are the unprefixed ones, so there is no
             reliance on which of two same-specificity utilities the
             stylesheet happens to emit last.

             The safe-area padding keeps the input and its question
             counter clear of the home indicator on a notched phone,
             where the sheet runs edge to edge. */
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-paper-white pb-[env(safe-area-inset-bottom)] sm:inset-auto sm:pb-0 sm:bottom-[96px] sm:right-24 sm:max-h-[min(560px,70svh)] sm:w-[min(calc(100vw-32px),400px)] sm:rounded-3xl sm:border sm:border-veil-gray"
        >
          <AskChat showContext={false} onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          /* Only the opening half is worth an event; closing a panel
             says nothing about interest. */
          if (!open) capture(EVENTS.agentOpened, { path: pathname });
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-label={open ? `Close ${assistant.name}` : `Ask ${assistant.name}`}
        /* A circle holding Arthur's face and nothing else. The name
           lives in `aria-label` and the tooltip rather than beside the
           avatar, so the control stays the same size in every language
           and never crowds the corner on a phone. */
        title={open ? `Close ${assistant.name}` : `Ask ${assistant.name}`}
        className={`fixed bottom-24 right-16 z-50 flex size-[56px] items-center justify-center overflow-hidden rounded-full border border-veil-gray bg-paper-white transition-colors hover:border-ink-black sm:right-24 ${
          /* The full-screen sheet carries its own CLOSE, so the round
             button would only be sitting on top of it. */
          open ? "max-sm:hidden" : ""
        }`}
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
