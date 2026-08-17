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
Nothing visitor-facing is hardcoded in components. Placeholders are in CAPS
(`YOUR ROLE`, `BOOK TITLE`, `YOUR-HANDLE`) — search for them and replace.

| What | Where |
| --- | --- |
| Name, hero headline, bio, email | `profile` in `site.ts` |
| Social links | `socials` |
| Nav items | `nav` |
| Roles, projects, posts, interests, books, notes | `work`, `projects`, `posts`, `interests`, `books`, `knowledge` |
| Section eyebrows/titles/intros | `sections` |
| Design tokens | `@theme` block in `src/app/globals.css` |

## Routes

| Route | Contents |
| --- | --- |
| `/` | Hero → Work → Projects → Writing (3 recent) → Interests → Books (3 recent) → Knowledge Bank → Contact |
| `/writing` | Full post archive |
| `/books` | Full shelf, sorted reading → finished → queued |
| `/knowledge` | All notes |

Interests, Books and the Knowledge Bank sit under one `#library` anchor so the
nav stays at four items, as the design system requires.

## Design system notes

The `@theme` block in `globals.css` is the amra token set verbatim. Some
consequences worth knowing before you edit styles:

- **Weight 400 only.** There is no bold in this system — hierarchy comes from
  size and letter-spacing. Only weight 400 of Inter Tight is loaded, so
  `font-bold` has nothing to resolve to. UA defaults on `<h1>`–`<h6>`,
  `<strong>` and `<b>` are reset to 400 as well.
- **`#acafff` appears in exactly two places** — the nav pill and the CONTACT
  button. Adding a third breaks the whole effect.
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
element, never a section background. Each feature card gets a different lighting
angle via the `variant` prop so the cards don't read as a repeated placeholder.
Replace the component's internals with an `<Image>` when you have a real render;
no layout changes needed.

## Still to do

- Replace every CAPS placeholder in `src/content/site.ts`
- `/writing` links point at `/writing/post-slug` routes that don't exist yet —
  add a `[slug]` route (MDX or otherwise) or point `href` at external posts
- Add an OG image and a favicon
