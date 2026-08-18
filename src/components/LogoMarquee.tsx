import { clients } from "@/content/site";

/**
 * Continuously scrolling strip of client logos.
 *
 * The track holds the list twice and translates by exactly -50%, so the
 * second copy arrives where the first began and the loop is seamless.
 * The duplicate is aria-hidden - screen readers get the list once.
 *
 * Pure CSS, no JS: it animates off the main thread and needs no
 * hydration. Reduced-motion callers get a static strip via the global
 * rule in globals.css.
 *
 * Names only, no logos: the marks arrived at wildly different weights
 * and grounds, and a row of mismatched chips read worse than a clean
 * line of wordmarks.
 */
export default function LogoMarquee() {
  const lane = [...clients.items, ...clients.items];

  return (
    <section
      aria-label={clients.title}
      className="w-full overflow-hidden py-40 md:py-56"
    >
      <p className="label mx-auto mb-32 w-full max-w-[var(--page-max-width)] px-24 text-smoke-gray sm:px-40">
        {clients.title}
      </p>

      {/* Edges fade into the canvas so logos enter and leave rather
          than being chopped off at the viewport edge. */}
      <div
        className="marquee relative"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <ul className="marquee-track flex w-max items-center gap-56 md:gap-100">
          {lane.map((client, i) => (
            <li
              key={`${client.name}-${i}`}
              aria-hidden={i >= clients.items.length ? "true" : undefined}
              className="shrink-0"
            >
              <span className="whitespace-nowrap text-subheading leading-subheading tracking-subheading text-smoke-gray">
                {client.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
