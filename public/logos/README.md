# Company logos

Used by the work cards (`/work` and the homepage Work section), via `logo` on
each entry in `work[]` in `src/content/site.ts`:

```ts
{ company: "Deloitte USI", logo: "/logos/deloitte-usi.png", ... }
```

They render inside a 48px square chip on an ink-black ground. That chip is doing
real work: these marks arrive at different weights, aspect ratios and
backgrounds. All three currently sit on dark grounds, so the chip blends with
them; it also guarantees a legible ground for any future mark that arrives
light or transparent. Square, full-bleed marks work best; anything portrait
should be padded to a square on a dark ground first.

The client strip below the hero is names only, so it does not read from here.

One thing worth checking before you ship: most of these are registered
trademarks, and companies usually publish brand guidelines covering how third
parties may display their marks. Using a client logo to describe work you
actually did is normally fine, but the rules differ per company.
