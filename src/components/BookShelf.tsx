"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { bookBuckets, books, type Book, type BookBucket } from "@/content/site";
import { Tag } from "@/components/Section";

/**
 * The shelf: a bucket menu across the top, a cover grid underneath.
 *
 * Two decisions worth knowing before you edit this.
 *
 * **Covers are optional.** Real cover art is the whole visual argument
 * of a page like this, but waiting on an image is how a books page
 * ends up a year out of date. Without one, `TypeCover` draws the title
 * and author on a flat ground instead. It cycles a four-colour palette
 * off the book's id, so a shelf of them reads as a deliberate set
 * rather than as four identical grey boxes - and every colour is drawn
 * from the page's own palette, so placeholders never out-shout a real
 * cover sitting next to them.
 *
 * **The remembered line is the point.** A grid of covers is a list of
 * titles with better typography; it says what you bought, not what you
 * got. The line under each cover is the only part a stranger can't
 * get from a photo of your shelf, so it is body-sized rather than
 * caption-sized, and it never truncates.
 */

/* Grounds for the fallback cover, drawn from the site's own palette:
   the accent, the ink, and the two tints already used by the hero
   mesh. Text colour is paired per ground - ink-black on the accent
   measures 1.7:1 and fails, so the dark grounds take paper-white. */
const GROUNDS = [
  { bg: "#002fa7", fg: "#ffffff" },
  { bg: "#141414", fg: "#ffffff" },
  { bg: "#dfeafa", fg: "#141414" },
  { bg: "#ece6d4", fg: "#141414" },
] as const;

function groundFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return GROUNDS[Math.abs(hash) % GROUNDS.length];
}

function TypeCover({ book }: { book: Book }) {
  const { bg, fg } = groundFor(book.id);
  return (
    <div
      className="flex h-full w-full flex-col justify-between p-16"
      style={{ backgroundColor: bg, color: fg }}
    >
      <span className="text-[15px] leading-subheading tracking-subheading">
        {book.title}
      </span>
      <span className="label opacity-70">{book.author}</span>
    </div>
  );
}

function Cover({ book }: { book: Book }) {
  /* Covers are referenced by path rather than imported, so a missing
     or misnamed file is a runtime 404 rather than a build error. Left
     alone that renders as a broken image on a page whose whole job is
     to look like a shelf - so a failed load falls back to the same
     typographic cover used when there is no `cover` at all. */
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(book.cover) && !failed;

  return (
    <div
      /* rounded-button (8px), not rounded-card (44px): a book-shaped
         box with a 44px radius stops reading as a book and starts
         reading as a card that happens to be portrait. */
      className="relative aspect-[2/3] w-full overflow-hidden rounded-button border border-veil-gray"
    >
      {showImage ? (
        <Image
          src={book.cover as string}
          alt={`${book.title} by ${book.author}`}
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <TypeCover book={book} />
      )}
    </div>
  );
}

/**
 * Empty bucket. A bucket with nothing in it needs to say "not yet"
 * rather than "nothing" - an unexplained blank panel reads as a bug,
 * and a visitor who lands on it should be able to tell in one glance
 * that the shelf is being filled rather than broken.
 *
 * The icon is a barrier rather than a spinner: a spinner implies
 * something is loading right now and will resolve if you wait.
 */
function EmptyShelf() {
  return (
    <div
      /* Capped and centred rather than full-bleed: stretched across
         the page a two-line message reads as a broken layout, which
         is the exact impression this is here to avoid. */
      className="mx-auto flex max-w-[420px] flex-col items-center gap-16 rounded-card border border-dashed border-veil-gray p-40 text-center"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-smoke-gray"
      >
        <rect x="2.75" y="8.75" width="26.5" height="14.5" rx="2.25" />
        {/* Hazard hatching, clipped to the barrier so the strokes stop
            at its edge instead of running past the corners. */}
        <clipPath id="wip-bars">
          <rect x="2.75" y="8.75" width="26.5" height="14.5" rx="2.25" />
        </clipPath>
        <g clipPath="url(#wip-bars)">
          {[-8, 0, 8, 16, 24].map((x) => (
            <line key={x} x1={x} y1="25" x2={x + 12} y2="7" />
          ))}
        </g>
      </svg>

      <p className="text-body leading-body tracking-body text-mist-gray">
        Will be updated soon.
      </p>
    </div>
  );
}

export default function BookShelf() {
  const [active, setActive] = useState<BookBucket>(bookBuckets[0]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const shown = books.filter((book) => book.bucket === active);

  /* Arrow keys move between tabs, which is what a tablist is expected
     to do - without it the menu is a row of buttons wearing tab roles. */
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const delta =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + bookBuckets.length) % bookBuckets.length;
    setActive(bookBuckets[next]);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      {/* Menu. Scrolls rather than wraps on narrow screens: three
          buckets at this letter-spacing overflow a 390px viewport, and
          a wrapped second row reads as a separate control. */}
      <div
        role="tablist"
        aria-label="Book categories"
        className="no-scrollbar -mx-24 flex gap-8 overflow-x-auto px-24 sm:mx-0 sm:px-0"
      >
        {bookBuckets.map((bucket, index) => {
          const selected = bucket === active;
          return (
            <button
              key={bucket}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(bucket)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`label shrink-0 whitespace-nowrap rounded-full px-16 py-8 transition-colors ${
                selected
                  ? "bg-ink-black text-paper-white"
                  : "border border-veil-gray text-smoke-gray hover:text-ink-black"
              }`}
            >
              {bucket}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-label={active}
        className="mt-40"
      >
        {shown.length === 0 ? (
          <EmptyShelf />
        ) : (
          <ul className="grid grid-cols-2 gap-x-24 gap-y-40 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((book) => (
              <li key={book.id}>
                <Cover book={book} />

                <h3 className="mt-16 text-[15px] leading-subheading tracking-subheading text-ink-black">
                  {book.title}
                </h3>
                <p className="label mt-8 text-smoke-gray">{book.author}</p>

                {book.inProgress ? (
                  <p className="mt-16">
                    <Tag>NOT YET FINISHED</Tag>
                  </p>
                ) : (
                  /* The hairline marks this as the remembered thing
                     rather than a blurb, so the framing does not have
                     to be repeated as a label on every card. Curly
                     quotes are typed in rather than left to CSS
                     `quotes`, which would not survive being copied
                     out of the page. */
                  <blockquote className="mt-16 border-l border-veil-gray pl-12 text-body leading-body tracking-body text-mist-gray">
                    &ldquo;{book.remember}&rdquo;
                  </blockquote>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
