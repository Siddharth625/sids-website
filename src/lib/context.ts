import { buildAgentMarkdown } from "@/lib/agent-markdown";

/**
 * How much of the model's context window the site itself occupies.
 *
 * The context bar used to be drawn against an invented 32k budget,
 * because the real window is a million tokens and a conversation about
 * a CV uses a few thousand - so an honest bar sat at zero and said
 * nothing. Showing the document's own footprint fixes that without
 * lying about the ceiling: the interesting quantity was never "how
 * close are we to the limit", it was "how much of what Arthur knows is
 * this site".
 *
 * Token counts are `characters / 4`, the usual English approximation.
 * They are labelled as estimates in the UI because they are: the exact
 * figures come back from the provider per request, and those are what
 * the conversation segment is drawn from.
 */

/** The window of the models in `MODELS` (chat route). All are 1M. */
export const MODEL_CONTEXT = 1_000_000;

const estimate = (text: string) => Math.round(text.length / 4);

/**
 * Split the generated markdown on its own headings rather than
 * re-deriving each section from `site.ts`. The document is what the
 * model is actually given, so measuring it directly is the only way
 * these numbers cannot drift from the real prompt.
 */
function sections() {
  const markdown = buildAgentMarkdown();
  const headings: { label: string; heading: string }[] = [
    { label: "Profile and bio", heading: "## About" },
    { label: "Work history", heading: "## Work" },
    { label: "Projects", heading: "## Projects" },
    { label: "Writing", heading: "## Writing" },
    { label: "Reading", heading: "## Reading" },
  ];

  const found = headings
    .map((h) => ({ ...h, at: markdown.indexOf(h.heading) }))
    .filter((h) => h.at !== -1)
    .sort((a, b) => a.at - b.at);

  /* Everything above the first heading - the name, role, contact
     details and industry list - belongs with the profile. */
  return found.map((h, index) => {
    const from = index === 0 ? 0 : h.at;
    const to = index === found.length - 1 ? markdown.length : found[index + 1].at;
    return { label: h.label, tokens: estimate(markdown.slice(from, to)) };
  });
}

export const CONTEXT_SECTIONS = sections();

export const DOC_TOKENS = CONTEXT_SECTIONS.reduce(
  (total, section) => total + section.tokens,
  0,
);
