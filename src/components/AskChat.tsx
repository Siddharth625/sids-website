"use client";

import Image from "next/image";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import { useEffect, useRef, useState } from "react";
import MeshGradient from "@/components/MeshGradient";
import { assistant, industries, profile, sections } from "@/content/site";
import { capture, EVENTS } from "@/lib/analytics";
import { type AskEvent, ctasFor, FREE_QUESTIONS } from "@/lib/ask";
import { CONTEXT_SECTIONS, DOC_TOKENS, MODEL_CONTEXT } from "@/lib/context";

/**
 * The chat itself, grounded in the same profile
 * document `/llms.txt` serves, with the context it is working from
 * shown alongside it.
 *
 * **The scroll behaviour.** The panel fills the viewport, pins while
 * you scroll past it, then releases: `position: sticky` inside a
 * taller wrapper, where the wrapper's surplus height *is* the pin
 * duration. `svh` rather than `vh` throughout - `100vh` on mobile is
 * the height with browser chrome hidden, which would put the input
 * under the address bar.
 *
 * **The transcript owns the only inner scrollbar**, with
 * `overscroll-contain` so reaching its end stops there rather than
 * yanking the page. That is also why the panel is a flex column with
 * `min-h-0` on the middle child: without it a long transcript grows
 * the flex item instead of scrolling inside it, and pushes the input
 * off-screen.
 *
 * **The question limit is a lead gate, not a security control.** It
 * lives in `sessionStorage`, so anyone who wants a fourth question can
 * have one. Spend is protected by the per-IP limit in the route; this
 * is only here to turn an interested visitor into an introduction.
 */

/* Openers. Three, because a row of six reads as a menu you must choose
   from rather than a hint that you can type anything.

   Each is chosen to put Sid's strongest material first: the document
   is densest on shipped work and hard numbers, so "shipped" and
   "results" both land on specifics rather than on adjectives, and the
   third asks the question a hiring manager is actually holding. Every
   one is answerable from the document - a suggested question the
   assistant has to decline is the worst possible first impression. */
const OPENERS = [
  "What has he shipped?",
  "What results has he driven?",
  "Why should I hire him?",
];

const ASKED_KEY = "ask-sid:asked";
const TURNS_KEY = "ask-sid:turns";

/* How long the last answer stays on screen before the contact form
   replaces it. Long enough to finish reading a few sentences, short
   enough that it doesn't read as the page having hung. */
const GATE_DELAY_MS = 3_000;

type Turn = {
  role: "user" | "assistant";
  content: string;
  /* Present once the answer is complete. */
  stats?: { inTokens: number; outTokens: number; ms: number };
};

type Lead = { name: string; email: string; phone: string; reason: string };

const EMPTY_LEAD: Lead = { name: "", email: "", phone: "", reason: "" };

export default function AskChat({
  /** Rendered inside the floating launcher as well as the homepage
      section, so the panel's own height is the caller's business. */
  className = "",
  showContext = true,
  onClose,
}: {
  className?: string;
  showContext?: boolean;
  onClose?: () => void;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [asked, setAsked] = useState(0);
  const [contextReady, setContextReady] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [lead, setLead] = useState<Lead>(EMPTY_LEAD);
  const [leadError, setLeadError] = useState("");
  const [leadSending, setLeadSending] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* Both the count and the transcript are per browser session, so a
     new tab starts fresh and closing this one takes the conversation
     with it. `sessionStorage` rather than `localStorage` is the whole
     point: a visitor should not find last week's questions waiting
     for them, and nothing here is worth keeping on their machine. */
  useEffect(() => {
    const storedCount = Number(sessionStorage.getItem(ASKED_KEY) ?? "0");
    if (Number.isFinite(storedCount)) setAsked(storedCount);

    const storedTurns = sessionStorage.getItem(TURNS_KEY);
    if (storedTurns) {
      try {
        const parsed = JSON.parse(storedTurns);
        if (Array.isArray(parsed)) setTurns(parsed);
      } catch {
        sessionStorage.removeItem(TURNS_KEY);
      }
    }
  }, []);

  /* Persist on every change rather than only at the end of an answer,
     so a reload mid-stream still restores what had arrived. */
  useEffect(() => {
    if (turns.length === 0) return;
    sessionStorage.setItem(TURNS_KEY, JSON.stringify(turns));
  }, [turns]);

  /* The context card resolves on mount rather than reporting a real
     fetch: the profile document is compiled into the route's system
     prompt, so by the time this renders it is already loaded. The
     short delay exists so the visitor sees *what* the assistant has
     been given rather than a state that was never not-ready. */
  useEffect(() => {
    const id = setTimeout(() => setContextReady(true), 900);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  /* Two flags, not one, and the difference matters.

     `spent` is the truth about the allowance and flips the moment a
     question is sent. `gated` is the *UI* consequence and lags it: it
     waits for the answer to finish streaming, then holds for a beat
     longer so the visitor can read the answer they just paid their
     last question for before the form takes the panel over.

     Guarding `ask()` on `gated` instead would leave that delay wide
     open - a visitor could get a fourth question in during it. So the
     send path is guarded on `spent`, and only the swap is delayed. */
  const spent = asked >= FREE_QUESTIONS;
  const [gated, setGated] = useState(false);

  useEffect(() => {
    if (!spent || busy) {
      setGated(false);
      return;
    }
    const id = setTimeout(() => setGated(true), GATE_DELAY_MS);
    return () => clearTimeout(id);
  }, [spent, busy]);

  /* Tokens in play, split into the two things actually occupying the
     window. The last exchange's prompt count already includes the
     document and whatever history the route kept, so subtracting the
     document leaves the conversation - a real measurement rather than
     a running sum, and it shrinks again when old turns are trimmed. */
  const lastStats = [...turns].reverse().find((t) => t.stats)?.stats;
  const chatTokens = lastStats
    ? Math.max(0, lastStats.inTokens - DOC_TOKENS) + lastStats.outTokens
    : 0;
  const contextUsed = DOC_TOKENS + chatTokens;

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy || spent) return;

    /* Fired on send rather than on answer: a question that failed
       upstream still tells us someone wanted to ask it. `index` is
       what shows how far into the three-question allowance visitors
       usually get. */
    capture(EVENTS.agentQuestion, {
      index: asked + 1,
      length: text.length,
      from_opener: OPENERS.includes(question),
    });

    const next: Turn[] = [...turns, { role: "user", content: text }];
    setTurns([...next, { role: "assistant", content: "" }]);
    setDraft("");
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok || !response.body) {
        const { error } = await response
          .json()
          .catch(() => ({ error: "Something broke. Try again in a moment." }));
        setTurns([...next, { role: "assistant", content: error }]);
        /* Deliberately not counted. A question that never got an
           answer should not spend one of the three - otherwise a
           visitor who arrives while the daily quota is exhausted burns
           the whole allowance on error messages and is handed the
           contact form having learned nothing about Sid. */
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      let stats: Turn["stats"];

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: AskEvent;
          try {
            event = JSON.parse(line);
          } catch {
            continue;
          }

          if (event.t === "delta") answer += event.v;
          else if (event.t === "done") stats = event;
          else if (event.t === "error") answer += `\n\n${event.message}`;
        }

        setTurns([...next, { role: "assistant", content: answer, stats }]);
      }

      setTurns([...next, { role: "assistant", content: answer, stats }]);

      /* Counted here, once an answer actually arrived. */
      const nextCount = asked + 1;
      setAsked(nextCount);
      sessionStorage.setItem(ASKED_KEY, String(nextCount));
    } catch {
      setTurns([
        ...next,
        {
          role: "assistant",
          content: "Couldn't reach the assistant. Try again in a moment.",
        },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  async function submitLead(event: React.FormEvent) {
    event.preventDefault();
    if (leadSending) return;

    if (!lead.name.trim()) return setLeadError("Your name, please.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) {
      return setLeadError("That email doesn't look right.");
    }

    setLeadError("");
    setLeadSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!response.ok) {
        const { error } = await response
          .json()
          .catch(() => ({ error: "Couldn't send that." }));
        setLeadError(error);
        return;
      }
      setLeadSent(true);
      /* No name, email or phone in the payload - the lead itself
         arrives by email, and PostHog only needs to know it happened
         and what came with it. */
      capture(EVENTS.contactSubmitted, {
        has_phone: Boolean(lead.phone.trim()),
        has_reason: Boolean(lead.reason.trim()),
        questions_asked: asked,
      });
    } catch {
      setLeadError("Couldn't send that. Try again in a moment.");
    } finally {
      setLeadSending(false);
    }
  }

  const empty = turns.length === 0;
  const exchanges = turns.filter((t) => t.role === "user").length;

  /* Development only. In production this would sit next to "0 of 3
     questions left" and read as an invitation to reset the allowance,
     which is the one thing the gate exists to prevent - the gate is
     already bypassable by clearing storage, but there is a difference
     between possible and offered. */
  const isDev = process.env.NODE_ENV === "development";

  function resetSession() {
    sessionStorage.removeItem(ASKED_KEY);
    sessionStorage.removeItem(TURNS_KEY);
    setTurns([]);
    setAsked(0);
    setShowHistory(false);
    setLead(EMPTY_LEAD);
    setLeadError("");
    setLeadSent(false);
    setDraft("");
  }

  /* The chat panel. Squarer than the rest of the site on purpose - a
     44px radius on a panel this size reads as a pill, and the message
     bubbles inside it need a radius of their own to sit against. */
  /* Embedded in the launcher the surrounding sheet already supplies
     the border, the rounding and the height, so the panel just fills
     it. Left with its own chrome it drew a second rounded box inside
     the first and stopped short of the bottom of a full-screen sheet. */
  const panelClass = showContext
    ? "flex min-h-0 flex-col rounded-3xl border border-veil-gray bg-paper-white/80 backdrop-blur-sm max-lg:min-h-[420px] lg:h-[min(560px,70svh)]"
    : "flex min-h-0 flex-1 flex-col";

  const chat = (
          <div className={panelClass}>
            <h2 className="sr-only">{sections.ask.title}</h2>

            {/* Only once the form takes the panel over. Before
                that the transcript is already on screen and a
                button to reveal it is noise; after, it is the only
                way back to the conversation a visitor just had, at
                exactly the moment they are asked to write to Sid
                about it. */}
            {gated && turns.length > 0 && (
              <div className="flex shrink-0 items-center justify-between gap-12 border-b border-veil-gray px-24 py-12 sm:px-32">
                <p className="label text-smoke-gray">
                  {showHistory ? "THIS SESSION" : "\u00A0"}
                </p>
                <button
                  type="button"
                  onClick={() => setShowHistory((v) => !v)}
                  className="label link-underline text-ink-black"
                >
                  {showHistory ? "BACK" : `HISTORY (${exchanges})`}
                </button>
              </div>
            )}

            <div
              ref={transcriptRef}
              className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain p-24 sm:p-32"
              aria-live="polite"
            >
              {showHistory ? (
                <Transcript turns={turns} busy={busy} />
              ) : leadSent ? (
                <p className="text-body leading-body tracking-body text-ink-black">
                  Thanks for reaching out! You will get a response soon.
                </p>
              ) : gated ? (
                <LeadForm
                  lead={lead}
                  setLead={setLead}
                  error={leadError}
                  sending={leadSending}
                  onSubmit={submitLead}
                />
              ) : empty ? (
                <div>
                  {/* Arthur introduces himself in the same shape a reply
                      arrives in - face on the left, words on the right -
                      so it is obvious before the first question who is
                      doing the answering. */}
                  <div className="flex gap-16">
                    <Image
                      src={assistant.avatar}
                      alt={assistant.name}
                      width={296}
                      height={296}
                      className="mt-4 size-32 shrink-0 rounded-full border border-veil-gray bg-paper-white object-cover"
                    />
                    <p className="min-w-0 flex-1 text-body leading-body tracking-body text-ink-black">
                      {sections.ask.intro}
                    </p>
                  </div>
                  {/* Indented to the width of the avatar plus its gap,
                      so the openers hang under Arthur's words rather
                      than under his face. */}
                  <p className="label ml-[48px] mt-24 text-smoke-gray">
                    ASK {assistant.name.toUpperCase()}
                  </p>
                  <ul className="ml-[48px] mt-16 flex flex-col items-start gap-8">
                    {OPENERS.map((opener) => (
                      <li key={opener}>
                        <button
                          type="button"
                          onClick={() => ask(opener)}
                          className="rounded-xl border border-veil-gray px-16 py-8 text-left text-caption leading-caption tracking-caption text-ink-black transition-colors hover:border-ink-black"
                        >
                          {opener}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Transcript turns={turns} busy={busy} />
              )}
            </div>

            {!gated && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  ask(draft);
                }}
                className="shrink-0 border-t border-veil-gray p-16 sm:px-24 sm:py-16"
              >
                <div className="flex items-end gap-12 rounded-2xl border border-veil-gray bg-paper-white px-16 py-12">
                  <label htmlFor="ask-input" className="sr-only">
                    Ask a question about {profile.fullName}
                  </label>
                  <textarea
                    ref={inputRef}
                    id="ask-input"
                    rows={1}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      /* Enter sends, shift+enter breaks the line -
                         the convention every chat box uses. */
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        ask(draft);
                      }
                    }}
                    placeholder="Ask anything"
                    maxLength={1000}
                    disabled={busy}
                    className="no-scrollbar max-h-[120px] min-w-0 flex-1 resize-none bg-transparent text-body leading-body tracking-body text-ink-black outline-none placeholder:text-smoke-gray disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={busy || !draft.trim()}
                    className="label shrink-0 rounded-lg bg-ink-black px-16 py-8 text-paper-white transition-opacity disabled:opacity-30"
                  >
                    {busy ? "..." : "ASK"}
                  </button>
                </div>

                <p className="label mt-12 text-smoke-gray">
                  {FREE_QUESTIONS - asked} OF {FREE_QUESTIONS} QUESTIONS
                  LEFT
                </p>
              </form>
            )}
          </div>

  );

  if (!showContext) {
    return (
      <div className={`flex min-h-0 flex-1 flex-col ${className}`}>
        <div className="flex shrink-0 items-center justify-between gap-12 border-b border-veil-gray px-24 py-12">
          <div className="flex items-center gap-12">
            <Image
              src={assistant.avatar}
              alt=""
              width={296}
              height={296}
              className="size-32 shrink-0 rounded-full border border-veil-gray bg-paper-white object-cover"
            />
            <div>
              <p className="text-caption leading-caption tracking-caption text-ink-black">
                {assistant.name}
              </p>
              <p className="label text-smoke-gray">{assistant.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="label text-smoke-gray transition-colors hover:text-ink-black"
          >
            CLOSE
          </button>
        </div>
        {chat}
      </div>
    );
  }

  return (
    <div className={`grid min-h-0 w-full gap-24 lg:grid-cols-[280px_1fr] ${className}`}>
      <ContextCard
        ready={contextReady}
        used={contextUsed}
        chatTokens={chatTokens}
        stats={lastStats}
        asked={asked}
        onReset={isDev ? resetSession : undefined}
      />
      {chat}
    </div>
  );
}

function Transcript({ turns, busy }: { turns: Turn[]; busy: boolean }) {
  return (
    <ul className="flex flex-col gap-32">
      {turns.map((turn, index) => (
        <li key={index}>
          {turn.role === "user" ? (
            <div className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-lg border border-veil-gray bg-paper-white px-16 py-12 text-body leading-body tracking-body text-ink-black">
                {turn.content}
              </p>
            </div>
          ) : (
            <Answer turn={turn} pending={busy} />
          )}
        </li>
      ))}
    </ul>
  );
}

/** One assistant turn: the answer, then what it cost and where to go next. */
function Answer({ turn, pending }: { turn: Turn; pending: boolean }) {
  const ctas = turn.stats ? ctasFor(turn.content) : [];

  return (
    <div className="flex gap-16">
      <Image
        src={assistant.avatar}
        alt={assistant.name}
        width={296}
        height={296}
        className="mt-4 size-32 shrink-0 rounded-full border border-veil-gray bg-paper-white object-cover"
      />

      <div className="min-w-0 flex-1">
        {turn.content ? (
          <Markdown>{turn.content}</Markdown>
        ) : (
          <p className="text-body leading-body tracking-body text-smoke-gray">
            {pending ? "Thinking" : " "}
          </p>
        )}

        {ctas.length > 0 && (
          <ul className="mt-16 flex flex-wrap gap-8">
            {ctas.map((cta) => (
              <li key={cta.href}>
                <Link
                  href={cta.href}
                  className="label inline-block rounded-lg border border-veil-gray px-12 py-4 text-ink-black transition-colors hover:border-ink-black"
                >
                  {cta.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {turn.stats && (
          <p className="label mt-16 text-smoke-gray">
            {turn.stats.inTokens.toLocaleString()} IN ·{" "}
            {turn.stats.outTokens.toLocaleString()} OUT ·{" "}
            {(turn.stats.ms / 1000).toFixed(1)}S
          </p>
        )}
      </div>
    </div>
  );
}

/** Left card: what the assistant is working from, and what it has spent. */
function ContextCard({
  ready,
  used,
  chatTokens,
  stats,
  asked,
  onReset,
}: {
  ready: boolean;
  used: number;
  chatTokens: number;
  stats?: Turn["stats"];
  asked: number;
  /** Only passed in development - see the note at the call site. */
  onReset?: () => void;
}) {
  /* The second colour is the palette's violet, the same one the hero
     headline uses - so "conversation" reads as a sibling of the site's
     own colours rather than a new one introduced for a chart. */
  const chatColor = industries.items[1].color;

  return (
    <aside className="flex flex-col gap-24 rounded-3xl border border-veil-gray bg-paper-white/70 p-24 backdrop-blur-sm max-lg:hidden">
      <div className="flex items-center gap-12">
        <Image
          src={assistant.avatar}
          alt=""
          width={296}
          height={296}
          className="size-40 shrink-0 rounded-full border border-veil-gray bg-paper-white object-cover"
        />
        <div className="min-w-0">
          <p className="text-body leading-body tracking-body text-ink-black">
            {assistant.name}
          </p>
          <p className="label text-smoke-gray">{assistant.role}</p>
        </div>
      </div>

      <div>
        <p className="label text-smoke-gray">CONTEXT</p>
        <p className="mt-12 text-body leading-body tracking-body text-ink-black">
          {ready ? assistant.contextNote : assistant.loadingNote}
        </p>
      </div>

      <ul className="flex flex-col gap-8">
        {CONTEXT_SECTIONS.map((section, index) => (
          <li
            key={section.label}
            className="flex items-center gap-12 text-caption leading-caption tracking-caption text-mist-gray"
          >
            {/* Ticks arrive in sequence rather than at once, so the
                card reads as loading rather than as a static list. */}
            <span
              aria-hidden="true"
              className={`block size-8 shrink-0 rounded-full transition-colors duration-500 ${
                ready ? "bg-klein-blue" : "bg-veil-gray"
              }`}
              style={{ transitionDelay: `${index * 90}ms` }}
            />
            <span className="flex-1">{section.label}</span>
            <span className="tabular-nums text-smoke-gray">
              {section.tokens.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      <div>
        <div className="flex items-baseline justify-between gap-8">
          <p className="label text-smoke-gray">CONTEXT USED</p>
          <p className="label text-ink-black">
            {used.toLocaleString()}/1M
          </p>
        </div>

        {/* Drawn against the model's real window rather than an
            invented budget. At this scale the truth is that the whole
            site is a rounding error - about a third of one percent -
            so each segment gets a minimum width to stay visible. The
            exact figures sit directly beneath, which is where the
            precision belongs; the bar is here to show the proportion
            between the two things in the window, not to be measured
            with a ruler. */}
        <div
          className="mt-12 flex h-4 w-full gap-[2px] overflow-hidden rounded-full bg-veil-gray"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={MODEL_CONTEXT}
          aria-valuenow={used}
          aria-label={`Context used: ${used.toLocaleString()} of ${MODEL_CONTEXT.toLocaleString()} tokens`}
        >
          <div
            className="h-full rounded-full bg-klein-blue transition-[width] duration-500"
            style={{
              width: `${Math.max((DOC_TOKENS / MODEL_CONTEXT) * 100, 3)}%`,
            }}
          />
          {chatTokens > 0 && (
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${Math.max((chatTokens / MODEL_CONTEXT) * 100, 1.5)}%`,
                backgroundColor: chatColor,
              }}
            />
          )}
        </div>

        <ul className="mt-12 flex flex-col gap-4">
          <li className="flex items-center gap-8 text-caption leading-caption tracking-caption text-mist-gray">
            <span
              aria-hidden="true"
              className="block size-8 shrink-0 rounded-full bg-klein-blue"
            />
            <span className="flex-1">This site</span>
            <span className="tabular-nums text-smoke-gray">
              {DOC_TOKENS.toLocaleString()}
            </span>
          </li>
          <li className="flex items-center gap-8 text-caption leading-caption tracking-caption text-mist-gray">
            <span
              aria-hidden="true"
              className="block size-8 shrink-0 rounded-full"
              style={{ backgroundColor: chatColor }}
            />
            <span className="flex-1">This conversation</span>
            <span className="tabular-nums text-smoke-gray">
              {chatTokens.toLocaleString()}
            </span>
          </li>
          <li className="flex items-center gap-8 text-caption leading-caption tracking-caption text-mist-gray">
            <span
              aria-hidden="true"
              className="block size-8 shrink-0 rounded-full bg-veil-gray"
            />
            <span className="flex-1">Free</span>
            <span className="tabular-nums text-smoke-gray">
              {(MODEL_CONTEXT - used).toLocaleString()}
            </span>
          </li>
        </ul>
      </div>

      <div className="border-t border-veil-gray pt-16">
        <p className="label text-smoke-gray">LAST RESPONSE</p>
        <p className="mt-8 text-caption leading-caption tracking-caption text-mist-gray">
          {stats
            ? `${stats.inTokens.toLocaleString()} in, ${stats.outTokens.toLocaleString()} out, ${(stats.ms / 1000).toFixed(1)}s`
            : "Nothing asked yet"}
        </p>
        <p className="mt-8 text-caption leading-caption tracking-caption text-mist-gray">
          {Math.max(0, FREE_QUESTIONS - asked)} of {FREE_QUESTIONS} questions
          left
        </p>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="label link-underline mt-16 text-ink-black"
          >
            RESET SESSION (DEV)
          </button>
        )}
      </div>
    </aside>
  );
}

/** Shown once the question allowance is spent. */
function LeadForm({
  lead,
  setLead,
  error,
  sending,
  onSubmit,
}: {
  lead: Lead;
  setLead: (lead: Lead) => void;
  error: string;
  sending: boolean;
  onSubmit: (event: React.FormEvent) => void;
}) {
  /* Sized to fit the panel without scrolling: at the previous
     padding and gaps the SEND button sat below the fold, so the form
     read as unfinished at exactly the moment it asks for trust. */
  const field =
    "mt-4 w-full rounded-xl border border-veil-gray bg-paper-white px-16 py-8 text-body leading-body tracking-body text-ink-black outline-none placeholder:text-smoke-gray focus:border-ink-black";

  return (
    <form onSubmit={onSubmit}>
      <p className="text-caption leading-caption tracking-caption text-ink-black">
        That&rsquo;s the {FREE_QUESTIONS} questions. Leave your details and Sid
        will pick it up from here.
      </p>

      <div className="mt-16 flex flex-col gap-12">
        <div>
          <label htmlFor="lead-name" className="label text-smoke-gray">
            NAME
          </label>
          <input
            id="lead-name"
            required
            value={lead.name}
            onChange={(e) => setLead({ ...lead, name: e.target.value })}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="lead-email" className="label text-smoke-gray">
            EMAIL
          </label>
          <input
            id="lead-email"
            type="email"
            required
            value={lead.email}
            onChange={(e) => setLead({ ...lead, email: e.target.value })}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="lead-phone" className="label text-smoke-gray">
            PHONE (OPTIONAL)
          </label>
          <input
            id="lead-phone"
            value={lead.phone}
            onChange={(e) => setLead({ ...lead, phone: e.target.value })}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="lead-reason" className="label text-smoke-gray">
            REASON FOR CONTACTING (OPTIONAL)
          </label>
          <textarea
            id="lead-reason"
            rows={2}
            value={lead.reason}
            onChange={(e) => setLead({ ...lead, reason: e.target.value })}
            className={`${field} resize-none`}
          />
        </div>
      </div>

      {error && (
        <p className="mt-16 text-caption leading-caption tracking-caption text-ink-black">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="label mt-16 rounded-xl bg-ink-black px-16 py-8 text-paper-white transition-opacity disabled:opacity-30"
      >
        {sending ? "SENDING..." : "SEND"}
      </button>
    </form>
  );
}
