/**
 * Thin wrapper over the PostHog snippet loaded in the root layout.
 *
 * Everything goes through here rather than touching `window.posthog`
 * at each call site, for two reasons: the snippet is loaded
 * `afterInteractive`, so early calls can land before it exists and
 * must not throw; and one file listing every event name is the only
 * way to keep them consistent once there are a dozen of them.
 */

type PostHog = {
  capture: (event: string, properties?: object) => void;
  __loaded?: boolean;
};

declare global {
  interface Window {
    posthog?: PostHog;
  }
}

/**
 * Events fired before the library is ready, held until it is.
 *
 * The snippet installs a stub on `window.posthog` that is meant to
 * queue calls, but it is only safe to use once `posthog.init` has run
 * - and a React effect can easily fire first, at which point calling
 * the stub throws `t.push is not a function` and takes the page's
 * render with it. Queuing here instead means the ordering does not
 * matter and nothing is lost either way.
 */
const pending: [string, object | undefined][] = [];
let flushing = false;

function ready(): PostHog | null {
  const ph = typeof window === "undefined" ? undefined : window.posthog;
  return ph && ph.__loaded && typeof ph.capture === "function" ? ph : null;
}

function flush() {
  const ph = ready();
  if (!ph) return;
  while (pending.length) {
    const next = pending.shift();
    if (next) ph.capture(next[0], next[1]);
  }
}

/** Poll briefly rather than forever - if it has not loaded by then it
    has been blocked, and holding events serves nobody. */
function scheduleFlush() {
  if (flushing || typeof window === "undefined") return;
  flushing = true;
  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    flush();
    if (pending.length === 0 || tries > 40) {
      window.clearInterval(timer);
      flushing = false;
    }
  }, 250);
}

export function capture(event: string, properties?: object) {
  if (typeof window === "undefined") return;
  const ph = ready();
  if (ph) {
    ph.capture(event, properties);
    return;
  }
  pending.push([event, properties]);
  scheduleFlush();
}

/**
 * Page-visit events, keyed by route.
 *
 * Named per page rather than relying on the automatic `$pageview`
 * alone: `$pageview` is there for funnels and paths, these are for
 * asking "how many people opened Learnings" without first having to
 * remember what its URL is.
 */
export const PAGE_EVENTS: Record<string, string> = {
  "/": "home_viewed",
  "/work": "work_viewed",
  "/projects": "projects_viewed",
  "/writing": "writing_viewed",
  "/books": "learnings_viewed",
  "/agent": "agent_view_viewed",
};

export const EVENTS = {
  agentOpened: "agent_launcher_opened",
  agentQuestion: "agent_question_asked",
  socialClicked: "social_clicked",
  contactSubmitted: "contact_form_submitted",
} as const;
