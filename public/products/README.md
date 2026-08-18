# Product thumbnails

Optional. Referenced by `thumbnail` on each entry in a role's
`products[]` in `src/content/site.ts`:

```ts
{ id: "createos", thumbnail: "/products/createos.png", ... }
```

Without one - or if the path 404s - the card draws a flat tile with the
product name instead, so a missing screenshot degrades rather than
showing a broken image. Add them and they appear with no code change.

Rendered into a 16:10 box with `object-cover`, so a normal browser
screenshot fits. Around 1200px wide is plenty.

Filenames currently expected:

- createos.png
- ai-cicd.png
- naas.png
- sybil.png
- nexus.png
- sales-model.png

## Award badges

`badge` on a product renders an image beside its name, linking out:

```ts
badge: {
  src: "/products/producthunt.png",
  alt: "CreateOS, #1 Product of the Day on Product Hunt",
  href: "https://www.producthunt.com/products/createos",
}
```

**`producthunt.png` is not here yet.** Save the official badge from the
CreateOS post on Product Hunt - the post page offers it under the embed
or badge option - and drop it in under that name. Until then the badge
simply does not render, the same way a missing thumbnail falls back to
a drawn tile.

Use Product Hunt's own asset rather than a redrawn one: it is their
trademark, it encodes the real post, and it stays correct if the
ranking or their branding changes.
