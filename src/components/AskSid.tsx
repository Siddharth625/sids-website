"use client";

import { useEffect, useRef, useState } from "react";
import MeshGradient from "@/components/MeshGradient";
import { profile, sections } from "@/content/site";

/**
 * The assistant section: a chat box, grounded in the same profile
 * document that /llms.txt serves, that answers questions about Sid.
 *
 * **The scroll behaviour** is the reason this is shaped the way it is.
 * The brief was a panel that fills the viewport, pins while you scroll
 * past it, then releases. That is `position: sticky` inside a taller
 * wrapper: the wrapper's extra height *is* the pin duration, so
 * `h-[190svh]` around an `h-svh` panel buys about 90vh of scroll with
 * the panel held still. Shorten the wrapper and it barely pins;
 * lengthen it and the page feels stuck.
 *
 * `svh` rather than `vh` throughout: on mobile `100vh` is the height
 * with browser chrome *hidden*, so a panel sized in `vh` has its last
 * ~90px - here, the input - under the address bar until you scroll.
 *
 * **Why the transcript owns the only inner scrollbar.** A pinned panel
 * with its own scrolling region is a trap if the region ever swallows
 * the page scroll, so the transcript is the one scrollable thing and
 * it uses `overscroll-contain`: hitting its end stops there rather
 * than yanking the page. Everything else is fixed height, which is
 * also why the panel is a flex column with `min-h-0` on the middle
 * child - without it a long transcript grows the flex item instead of
 * scrolling inside it, and pushes the input off-screen.
 */

/* Openers. Three, because a row of six reads as a menu you have to
   choose from rather than a hint that you can type anything. Each one
   is answerable from the profile document - a suggested question the
   assistant has to punt on is a bad first impression. */
const OPENERS = [
  "What does he do now?",
  "What has he built?",
  "Why should I hire him?",
];

type Turn = { role: "user" | "assistant"; content: string };

export default function AskSid() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Follow the answer as it streams. */
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;

    const next: Turn[] = [...turns, { role: "user", content: text }];
    setTurns([...next, { role: "assistant", content: "" }]);
    setDraft("");
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!response.ok || !response.body) {
        const { error } = await response
          .json()
          .catch(() => ({ error: "Something broke. Try again in a moment." }));
        setTurns([...next, { role: "assistant", content: error }]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setTurns([...next, { role: "assistant", content: answer }]);
      }
    } catch {
      setTurns([
        ...next,
        { role: "assistant", content: "Couldn't reach the assistant. Try again in a moment." },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  const empty = turns.length === 0;

  return (
    <section id="ask" aria-label={sections.ask.title} className="relative">
      {/* The wrapper's surplus height is the pin duration. */}
      <div className="h-[190svh]">
        <div className="sticky top-0 isolate flex h-svh flex-col overflow-hidden px-24 pb-32 pt-[104px] sm:px-40 sm:pb-40">
          <MeshGradient flip />

          {/* One centred column. The explanatory panel that used to sit
              on the left is gone: the openers inside the box already
              say what it does, and a wall of prose next to a chat box
              is read once and then in the way on every later visit. */}
          <div className="mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col justify-center">
            <h2 className="sr-only">{sections.ask.title}</h2>

            <div className="flex min-h-0 flex-col rounded-card border border-veil-gray bg-paper-white/80 backdrop-blur-sm max-md:flex-1 md:h-[min(560px,72svh)]">
              <div
                ref={transcriptRef}
                className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain p-24 sm:p-32"
                aria-live="polite"
                aria-atomic="false"
              >
                {empty ? (
                  <div>
                    <p className="text-body leading-body tracking-body text-ink-black">
                      {sections.ask.intro}
                    </p>
                    <p className="label mt-24 text-smoke-gray">TRY ASKING</p>
                    <ul className="mt-16 flex flex-col items-start gap-8">
                      {OPENERS.map((opener) => (
                        <li key={opener}>
                          <button
                            type="button"
                            onClick={() => ask(opener)}
                            className="rounded-full border border-veil-gray px-16 py-8 text-left text-caption leading-caption tracking-caption text-ink-black transition-colors hover:border-ink-black"
                          >
                            {opener}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-24">
                    {turns.map((turn, index) => (
                      <li
                        key={index}
                        className={
                          turn.role === "user" ? "flex justify-end" : ""
                        }
                      >
                        {turn.role === "user" ? (
                          <p className="max-w-[85%] rounded-card border border-veil-gray px-16 py-12 text-body leading-body tracking-body text-ink-black">
                            {turn.content}
                          </p>
                        ) : (
                          <p className="whitespace-pre-wrap text-body leading-body tracking-body text-ink-black">
                            {turn.content || (
                              <span className="text-smoke-gray">Thinking</span>
                            )}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  ask(draft);
                }}
                className="flex shrink-0 items-center gap-12 border-t border-veil-gray p-16 sm:px-32 sm:py-24"
              >
                <label htmlFor="ask-input" className="sr-only">
                  Ask a question about {profile.fullName}
                </label>
                <input
                  ref={inputRef}
                  id="ask-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask anything"
                  autoComplete="off"
                  maxLength={1000}
                  disabled={busy}
                  className="min-w-0 flex-1 bg-transparent text-body leading-body tracking-body text-ink-black outline-none placeholder:text-smoke-gray disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={busy || !draft.trim()}
                  className="label shrink-0 rounded-full bg-ink-black px-16 py-8 text-paper-white transition-opacity disabled:opacity-30"
                >
                  {busy ? "..." : "ASK"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
