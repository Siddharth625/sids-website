# sids-website

Personal site built with Next.js 16 (App Router) and Tailwind CSS v4, styled to
the **amra** design system.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # all routes prerender as static HTML
```

## Where to edit things

**All copy lives in one file: [`src/content/site.ts`](src/content/site.ts).**

`profile.fullName` drives the nav wordmark (lowercased there, as a logotype),
the hero H1, the page title and the footer copyright.

Nothing visitor-facing is hardcoded in components. Placeholders are in CAPS
(`YOUR ROLE`, `BOOK TITLE`, `YOUR-HANDLE`) — search for them and replace.

| What | Where |
| --- | --- |
| Name, title, tagline, email | `profile` in `site.ts` |
| Social links | `socials` |
| Nav items | `nav` |
| Roles, projects, posts, interests, books, notes | `work`, `projects`, `posts`, `interests`, `books`, `knowledge` |
| Section eyebrows/titles/intros | `sections` |
| Design tokens | `@theme` block in `src/app/globals.css` |

## Routes

| Route | Contents |
| --- | --- |
| `/` | Hero (name left, cymatic plate right) → Work → Projects → Writing → Interests → Books → Knowledge Bank → Contact, each previewing its own page |
| `/work` | Full role history |
| `/projects` | Full project list |
| `/writing` | Full post archive |
| `/library` | Hub for the three "input" collections: Interests in full, Books and Knowledge Bank previewed |
| `/books` | Full shelf, sorted reading → finished → queued |
| `/knowledge` | All notes |

Nav holds exactly four items — WORK, PROJECTS, WRITING, LIBRARY — as the design
system requires; Books and the Knowledge Bank are reached through `/library`.
Every page except the homepage wraps in `<PageShell>`, which exists solely to
clear the fixed nav pill.

## Design system notes

The `@theme` block in `globals.css` is the amra token set verbatim. Some
consequences worth knowing before you edit styles:

- **Weight 400 only.** There is no bold in this system — hierarchy comes from
  size and letter-spacing. Only weight 400 of Inter Tight is loaded, so
  `font-bold` has nothing to resolve to. UA defaults on `<h1>`–`<h6>`,
  `<strong>` and `<b>` are reset to 400 as well.
- **The accent `#002fa7` (International Klein Blue) appears in exactly one
  place** — the CONTACT button. Adding a second breaks the whole effect. It
  replaces the spec's `#acafff`, and because it's dark rather than a pale tint,
  its foreground is white (`--color-on-accent`), not `#141414` — ink-black on
  it measures 1.7:1 and fails WCAG.
- **The nav pill inverts on scroll.** Transparent over white at the top of the
  page (ink-black wordmark and links, accent-filled CONTACT button); accent-
  filled once scrolled, at which point the wordmark and links go white and the
  CONTACT button flips to a white fill with accent text — an accent button on
  an accent pill would be invisible. Both states measure 10.69:1 or better.
  The focus ring inverts to white inside the filled pill for the same reason.
- **Spacing tokens override Tailwind's dynamic scale.** Because `--spacing-4:
  4px` is defined, `p-4` is **4px**, not the stock 16px. Only the declared steps
  exist (4, 8, 12, 16, 24, 32, 40, 56, 100, 104, 160); anything else falls back
  to Tailwind's multiplier and will be inconsistent. Use an arbitrary value like
  `p-[72px]` instead of inventing a step.
- **No shadows.** Surfaces are defined by radius and whitespace only.
- **No dividers between sections.** The 100–160px gap *is* the divider.
  `<Section>` contributes half the gap top and bottom so two adjacent sections
  sum to the target, rather than doubling it.
- Type utilities are applied in threes: `text-body leading-body tracking-body`.

### Fonts

The original spec's four font families (`'Primary Font'`, etc.) are placeholder
names that resolve to nothing. They're all mapped onto `--font-amra-sans`, which
is **Inter Tight** — the spec's own named substitute — loaded via `next/font`.
To swap in a licensed face (Neue Haas Grotesk, Söhne), change `--font-amra-sans`
in `globals.css` and every utility follows.

### The gradient sphere

[`src/components/Sphere.tsx`](src/components/Sphere.tsx) is a CSS stand-in for
what the spec describes as a 3D-rendered image asset. It's a *contained*
element, never a section background. Its gradient runs white → pale blue →
`#002fa7` → deep navy, retuned off the spec's lavender-to-teal to match the
accent. Each feature card gets a different lighting angle via the `variant` prop
so the cards don't read as a repeated placeholder.
Replace the component's internals with an `<Image>` when you have a real render;
no layout changes needed.

### Signal field (hero)

[`src/components/SignalField.tsx`](src/components/SignalField.tsx) is the hero's
argument, not its decoration. Particles rest as scattered noise and resolve into
the shapes an AI PM actually pulls out of messy data:

**Ambient set** — cycles on its own:

| Figure | Reads as |
| --- | --- |
| **Clusters** | Raw observations separating into distinct themes |
| **Curve** | A noisy trace converging, plotted against axes |
| **Attention** | A sparse matrix — what the model decided mattered |

**Concept set** — swaps in while the pointer is over the field, and back out on
leave: an icon over its word, for **Prioritization**, **Positioning**,
**Process** and **People**. On touch, tapping the field cycles them.

Icons and letterforms have no closed-form description to sample the way the
clusters and curve do, so they're drawn to an offscreen canvas and read back as
a point set (`sampleDrawing`). Everything downstream is unchanged. Two details
matter for legibility:

- **Dots shrink to 1.3 in concept mode.** At the ambient size a dot is wider
  than a letter stroke, so the counters fill in and the word reads as a blob.
- **The label is fitted to the canvas width**, not set at a fixed size —
  "PRIORITIZATION" is twice the length of "PEOPLE", and at one size either the
  long word overflows or the short one is too small to survive being drawn in
  dots.

Switching sets does not wait out the cycle: the current mix is frozen into A,
the new figure goes into B, and the cycle restarts so the morph begins on the
hover rather than up to 13s later.

Add an ambient figure by writing a generator and appending it to `AMBIENT`; add
a concept by appending to `CONCEPTS`.

- **It only starts once the pointer moves in the first fold.** Before that it
  renders one still frame of noise and runs no animation loop at all.
- **The cycle is continuous — there is no hold phase.** The blend runs
  unbroken and is eased with smootherstep, slow at both ends and quick through
  the middle, so a figure lingers long enough to read without ever halting.
  Resolved figures also carry a small per-particle drift; without it they are
  exactly static near the endpoints and read as the animation having stopped.
- **Transitions route through the noise cloud.** Interpolating one figure
  straight into another parks every particle in the gap between two unrelated
  shapes, which reads as a blob; scattering and re-gathering keeps it legible
  and restates "signal over noise" on every change.
- **The scatter curve is `sin(πu)⁸`, not `sin(πu)`.** Position is a straight
  mix between the noise and figure buffers, and the noise cloud is wider than
  the figures — so even 10% of noise left in jitters particles further than a
  cluster's own spread and the figure stops reading. Only a narrow, deep spike
  keeps the field legible for most of the cycle.
- **Legibility comes from anchors.** The curve has particle-drawn axes and the
  matrix has a frame; without them they read as a squiggle and as floating
  squares. Cluster spread is held well under half the minimum centre separation
  — at wider spreads neighbouring tails merge into one blob.
- Colour carries the idea too: noise is mist-gray, resolved signal is Klein
  blue, and the ink is held back until a figure has nearly formed.
- The next figure is built in `requestIdleCallback` during the hold rather than
  inline in a render frame.
- Three.js is `import()`ed inside the effect, so it is code-split out of the
  initial bundle. Reduced-motion renders one static figure; the loop also pauses
  when the hero scrolls out of view or the tab is hidden.

### Hero profile card (removed)

The terminal-style card that used to sit in the right half of the hero was
replaced by the cymatic plate. `public/portrait.jpg` is still on disk but is no
longer referenced anywhere — your portrait does not currently appear on the
site.

**Note:** filling the right half means the hero headline is left-aligned, which
departs from the source spec's "centre the hero headline" rule. A centred
headline in a half-width column reads as accidental, and the whole page now
shares a single left axis.

## Still to do

- Replace every CAPS placeholder in `src/content/site.ts`
- `/writing` links point at `/writing/post-slug` routes that don't exist yet —
  add a `[slug]` route (MDX or otherwise) or point `href` at external posts
- Add an OG image and a favicon
