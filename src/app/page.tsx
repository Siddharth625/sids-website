import AskSid from "@/components/AskSid";
import SignalField from "@/components/SignalField";
import Footer from "@/components/Footer";
import LogoMarquee from "@/components/LogoMarquee";
import MeshGradient from "@/components/MeshGradient";
import Timeline from "@/components/Timeline";
import { Pill, Section, SectionHeader } from "@/components/Section";
import {
  industries,
  profile,
  sections,
} from "@/content/site";

/* The cluster palette, in the order the particle field resolves into
   it. Taken from `industries` rather than restated, so the headline
   and the field can never drift onto different colours.
   
   Filtered, though. Those hues were chosen as 8px dots on a pill,
   where contrast barely matters; as 44px words on the near-white hero
   several of them are unreadable. Measured on the rendered pixels,
   Cloud Infrastructure's sky blue came out at 2.02:1 against the hero
   - under the 3:1 that large text needs, let alone the 4.5:1 kept
   everywhere else on this site. The survivors clear 4.5:1, so the
   headline stays legible if the hero gradient is ever lightened. */
const HEADLINE_COLORS = industries.items
  .map((item) => item.color)
  .filter((color) => contrastOnWhite(color) >= 4.5);

/** WCAG relative luminance contrast against the paper-white canvas. */
function contrastOnWhite(hex: string) {
  const channel = (value: number) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  const [r, g, b] = [1, 3, 5].map((i) =>
    channel(parseInt(hex.slice(i, i + 2), 16) / 255),
  );
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (luminance + 0.05);
}

/* The headline's tail, split into words so each can take its own
   colour. Falls back to rendering the whole headline plain if the
   accent phrase is not actually in it, so editing one without the
   other degrades rather than throwing. */
const accentAt = profile.headline.lastIndexOf(profile.headlineAccent);
const lead =
  accentAt === -1 ? profile.headline : profile.headline.slice(0, accentAt);
const accentWords =
  accentAt === -1 ? [] : profile.headlineAccent.split(" ").filter(Boolean);

export default function Home() {
  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────────
          Two columns: name left, signal field right.
          Note this departs from the spec's "centre the hero
          headline" rule - a centred headline in a half-width
          column reads as accidental. Filling the right half forces
          the choice, so the headline is left-aligned and the whole
          page now shares one axis. */}
      <section className="relative isolate overflow-hidden px-24 pb-56 pt-[132px] sm:px-40 md:min-h-[100svh]">
        <MeshGradient />

        {/* Equal columns with a tighter gutter. Both halves are capped
            by their column rather than by their own max-width, so the
            split is the only lever on either one - this buys the text
            ~96px without taking much off the field. */}
        <div className="mx-auto grid max-w-[var(--page-max-width)] items-center gap-x-56 gap-y-56 md:min-h-[calc(100svh-188px)] md:grid-cols-2">
          <div className="relative z-10">
            {/* The role is the one thing a visitor should read first
                after the headline, so it gets the accent fill rather
                than sitting as plain muted text. */}
            <Pill tone="accent" dot>
              {profile.role}
            </Pill>

            <h1 className="mt-32 text-[30px] leading-display tracking-display text-ink-black sm:text-[38px] lg:text-[44px]">
              {lead}
              {accentWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  style={{ color: HEADLINE_COLORS[index % HEADLINE_COLORS.length] }}
                >
                  {word}
                  {index < accentWords.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>

            {/* Body size, not subheading - see the note in site.ts.
                Ink-black, not mist-gray: over the tinted hero the muted
                grey measured 1.6:1, far under the 4.5:1 minimum, and
                this paragraph is the page's primary prose rather than
                secondary copy. Hierarchy here comes from size, which is
                how this design system is meant to work anyway. */}
            {/* max-w sits above the column width so the column governs
                - it's a guard against very wide viewports, not the
                thing setting the measure. */}
            <p className="mt-32 max-w-[620px] text-body leading-body tracking-body text-ink-black">
              {profile.bio}
            </p>

            <p className="label mt-40 text-ink-black">{industries.title}</p>
            <ul className="mt-16 flex max-w-[620px] flex-wrap items-center gap-8">
              {industries.items.map((item) => (
                <li key={item.name}>
                  <Pill dot dotColor={item.color}>
                    {item.name}
                  </Pill>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 flex justify-center md:justify-end">
            <SignalField />
          </div>
        </div>

        {/* The bottom-left hero sphere was removed on request. To
            bring it back, restore:

            <div className="pointer-events-none absolute bottom-0 left-0 hidden -translate-x-[30%] translate-y-[58%] md:block">
              <Sphere className="w-[440px]" />
            </div>

            The sphere still appears inside every project feature
            card. */}
      </section>

      <LogoMarquee />

      {/* ── TIMELINE ────────────────────────────────────────────
          Roles come from `work`; the studies come from `education`. */}
      <Section id="timeline">
        <SectionHeader {...sections.timeline} />
        <Timeline />
      </Section>

      {/* Pins to the viewport as you reach it, then releases. See the
          note in AskSid.tsx for why the wrapper is taller than the
          panel. */}
      <AskSid />

      <Footer />
    </div>
  );
}
