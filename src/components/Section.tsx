import type { ReactNode } from "react";

/**
 * Top-level wrapper for every page that isn't the homepage.
 *
 * Its only job is clearing the fixed nav pill. Kept here rather than
 * passed into <Section> as a className, where it would collide with
 * the section's own responsive vertical padding.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return <div className="pt-100 lg:pt-[120px]">{children}</div>;
}

/**
 * Vertical rhythm is the only section divider in this system - the
 * spec forbids visible hairlines between sections, so the 100–160px
 * gap *is* the separator. Scaled down on small screens, where 160px
 * of white reads as a broken page rather than as breathing room.
 */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      /* Half the target gap, top and bottom - two adjacent sections
         then add up to the spec's 100–160px, rather than doubling it
         to 320px. */
      className={`mx-auto w-full max-w-[var(--page-max-width)] px-24 py-40 sm:px-40 md:py-56 lg:py-[80px] ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Eyebrow / title / intro stack. Left-aligned always - the spec
 * centres the hero and nothing else.
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="mb-56 max-w-[640px]">
      <p className="label text-smoke-gray">{eyebrow}</p>
      <h2 className="mt-24 text-[24px] leading-heading tracking-heading text-ink-black sm:text-heading">
        {title}
      </h2>
      {intro && (
        <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
          {intro}
        </p>
      )}
    </header>
  );
}

/**
 * Centred pull quote.
 *
 * Centring is a deliberate exception: the design system centres the
 * hero and left-aligns everything after it. A quote standing in for a
 * section header is the one other place it earns its keep, because it
 * is not the reader's own material.
 */
export function Quote({ text, author }: { text: string; author: string }) {
  return (
    <figure className="mx-auto max-w-[760px] text-center">
      <blockquote className="text-[22px] leading-heading tracking-heading text-ink-black sm:text-heading">
        &ldquo;{text}&rdquo;
      </blockquote>
      <figcaption className="label mt-24 text-smoke-gray">{author}</figcaption>
    </figure>
  );
}

/**
 * Impact chip: the metric in green, its label in muted grey.
 *
 * Splits on the first space. Every impact string is written
 * metric-first ("120% revenue lift", "#1 Product of the Day"), so the
 * leading token is the number and the rest is the noun it belongs to.
 *
 * Casing is applied in JS rather than with the `label` utility's CSS
 * uppercase, because that would flatten deliberate mixed-case words:
 * "MoUs" became "MOUS". A word carrying a capital anywhere after its
 * first letter is left exactly as written, which also protects names
 * like CreateOS or NodeOps if they turn up here later.
 */
const preserveCase = (word: string) =>
  /[A-Z]/.test(word.slice(1)) ? word : word.toUpperCase();

/**
 * Label-styled text that uppercases in JS instead of CSS, so words
 * carrying deliberate internal capitals survive: "CreateOS" rather
 * than "CREATEOS", "MoUs" rather than "MOUS".
 */
export function CasedLabel({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={`text-caption leading-caption tracking-caption ${className}`}
    >
      {children.split(" ").map(preserveCase).join(" ")}
    </span>
  );
}

export function ImpactPill({ children }: { children: string }) {
  const [metric, ...rest] = children.split(" ");
  return (
    <span className="self-start rounded-button border border-veil-gray px-8 py-4 text-caption leading-caption tracking-caption text-smoke-gray">
      <span className="text-metric-green">{preserveCase(metric)}</span>
      {rest.length > 0 && <> {rest.map(preserveCase).join(" ")}</>}
    </span>
  );
}

/**
 * Fully-rounded pill with a soft fill - used for the hero's industry
 * list and role badge.
 *
 * Distinct from <Tag>, which is a square-ish 8px-radius outline chip
 * for metadata inside cards and rows. This one sits on the tinted hero,
 * so it carries a translucent white fill to lift off the gradient.
 *
 * `tone="accent"` fills it with the accent and flips the text to white
 * (10.69:1) - ink-black on the accent measures 1.7:1 and fails.
 */
export function Pill({
  children,
  tone = "default",
  dot = false,
  dotColor,
}: {
  children: ReactNode;
  tone?: "default" | "accent";
  dot?: boolean;
  /** Overrides the dot colour - used to code the industry list. */
  dotColor?: string;
}) {
  const accent = tone === "accent";
  return (
    <span
      className={`label inline-flex items-center gap-8 rounded-full px-16 py-8 ${
        accent
          ? "bg-klein-blue text-on-accent"
          : "border border-veil-gray bg-paper-white/70 text-ink-black"
      }`}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`block size-8 shrink-0 rounded-full ${
            dotColor ? "" : accent ? "bg-paper-white" : "bg-klein-blue"
          }`}
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        />
      )}
      {children}
    </span>
  );
}

/**
 * Page-title block for hub pages. A full <Section> here would stack
 * its bottom padding against the next section's top padding and leave
 * a ~200px dead gap under the title, so this carries the container and
 * horizontal padding only.
 */
export function PageHeader(props: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-24 pt-24 sm:px-40">
      <SectionHeader {...props} />
    </div>
  );
}

/**
 * Uppercase tracked-out tag chip. Outline only - the accent is
 * reserved for the CONTACT button.
 *
 * `self-start` matters: inside a flex-column card the chip would
 * otherwise stretch to the full card width and read as a text input.
 */
export function Tag({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  /* `strong` is for pills sitting on the tinted hero, where smoke-gray
     measures under 2:1. On the white canvas elsewhere, muted is fine. */
  tone?: "muted" | "strong";
}) {
  return (
    <span
      className={`label self-start rounded-button border border-veil-gray px-8 py-4 ${
        tone === "strong" ? "text-ink-black" : "text-smoke-gray"
      }`}
    >
      {children}
    </span>
  );
}

/**
 * List row used by Work, Writing, Books and the Knowledge Bank.
 * The hairline is a *within-list* divider (permitted, veil-gray), not
 * a between-section one (forbidden).
 */
export function Row({ children }: { children: ReactNode }) {
  return (
    <li className="border-t border-veil-gray py-32 first:border-t-0 first:pt-0">
      {children}
    </li>
  );
}
