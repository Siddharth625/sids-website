/**
 * Shared contract between the assistant's UI and its route.
 *
 * Both sides need the same numbers - the question allowance, the
 * context budget the progress bar is drawn against - and duplicating
 * them is how the bar ends up disagreeing with the gate.
 */

/** Questions a visitor gets before the contact form takes over. */
export const FREE_QUESTIONS = 3;

/**
 * The budget the context bar is measured against.
 *
 * Deliberately *not* the model's own window. That window is a million
 * tokens and a conversation about a CV uses a few thousand, so a bar
 * drawn against it sits at zero forever and tells the visitor nothing.
 * This is the working budget for one session: the profile document
 * plus the turns kept in play. It is a real limit - the route drops
 * the oldest turns as a conversation approaches it - and it moves
 * visibly, which is the only way a progress bar earns its space.
 */
export const CONTEXT_BUDGET = 32_000;

/** What the route streams back, one JSON object per line. */
export type AskEvent =
  | { t: "delta"; v: string }
  | { t: "done"; inTokens: number; outTokens: number; ms: number }
  | { t: "error"; message: string };

/**
 * Pages the assistant can point at.
 *
 * Matched against the answer text in the browser rather than asked of
 * the model. A model told to emit links will invent routes that don't
 * exist; a lookup table can only ever produce the four that do.
 */
export const SECTION_CTAS: {
  href: string;
  label: string;
  match: RegExp;
}[] = [
  {
    href: "/work",
    label: "See the work",
    match: /\b(nodeops|blueurbn|deloitte|consulting haus|fincrux|alpha ai|unesp|role|product manager|analyst|intern(ship)?s?)\b/i,
  },
  {
    href: "/projects",
    label: "See the projects",
    match: /\b(createos|nexus|project|shipped|built|launch(ed)?|prototype|platform)\b/i,
  },
  {
    href: "/writing",
    label: "Read the writing",
    match: /\b(wrote|writing|article|essay|post|published|medium)\b/i,
  },
  {
    href: "/books",
    label: "See what he reads",
    match: /\b(book|books|read(s|ing)?|meluha|nagas|housel|manson|dweck|maltz|horowitz|eyal|yogananda)\b/i,
  },
];

export function ctasFor(answer: string) {
  return SECTION_CTAS.filter((cta) => cta.match.test(answer)).slice(0, 3);
}
