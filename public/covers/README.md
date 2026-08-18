# Book covers

Optional. Referenced by `cover` on each entry in `books[]` in
`src/content/site.ts`:

```ts
{ id: "book-3", title: "...", cover: "/covers/almanack.jpg", ... }
```

Without a `cover` the shelf draws a typographic cover instead (title
and author on a flat ground from the site palette), so a book can go up
the moment you finish it rather than waiting on an image. Mixing the
two is fine and looks deliberate.

Covers render into a 2:3 box with `object-cover`, so anything close to
a standard book aspect ratio works; square or landscape images will be
cropped top and bottom. Around 600px on the long edge is plenty.

Cover art is the publisher's copyright. Showing a cover to say you read
the book is the ordinary use and is what every bookshop and review site
does, but it is not the same as a public-domain image - worth knowing
before you scrape a few hundred of them.
