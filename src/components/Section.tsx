import type { ReactNode } from "react";

/**
 * Vertical rhythm is the only section divider in this system — the
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
      /* Half the target gap, top and bottom — two adjacent sections
         then add up to the spec's 100–160px, rather than doubling it
         to 320px. */
      className={`mx-auto w-full max-w-[var(--page-max-width)] px-24 py-40 sm:px-40 md:py-56 lg:py-[80px] ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Eyebrow / title / intro stack. Left-aligned always — the spec
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
 * Uppercase tracked-out tag chip. Outline only — no fills but periwinkle.
 *
 * `self-start` matters: inside a flex-column card the chip would
 * otherwise stretch to the full card width and read as a text input.
 */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="label self-start rounded-button border border-veil-gray px-8 py-4 text-smoke-gray">
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
