# Client logos

The strip below the hero renders each entry in `clients.items`
(`src/content/site.ts`). Until a logo file exists, an entry falls back to its
name set as a wordmark, so the strip looks deliberate rather than broken.

To use a real logo:

1. Drop the file in this folder, e.g. `public/logos/deloitte.svg`
2. Set `logo` on that entry:

```ts
{ name: "Deloitte", logo: "/logos/deloitte.svg" },
```

**Prefer monochrome SVG.** The strip is rendered greyscale at 60% opacity to
stay inside the near-achromatic palette — seven full-colour brand marks would be
the loudest thing on the page by a wide margin. Logos are height-constrained
(32px, 40px from `md`) with width set to auto, so any aspect ratio works.

One thing worth checking before you ship: most of these are registered
trademarks, and companies usually publish brand guidelines covering how third
parties may display their marks. Using a client logo to describe work you
actually did is normally fine, but the rules differ per company — Google in
particular has specific requirements for "Google for Startups".
