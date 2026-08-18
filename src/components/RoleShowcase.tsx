"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CasedLabel } from "@/components/Section";
import type { Role, RoleProduct } from "@/content/site";

/**
 * One role as a single bordered card: who and where at the top, then
 * everything shipped inside it as a list.
 *
 * This replaced a carousel. The carousel put one role on screen at a
 * time behind a horizontal scroll, which meant the second and third
 * roles were invisible unless a visitor thought to drag - and hid the
 * products entirely, since there was no room for them beside the
 * metrics. A stacked card costs vertical space and shows everything.
 */

/** Read More and its modal, off for now. One flag, nothing deleted. */
const READ_MORE_ENABLED = false;

/* Grounds for the drawn thumbnail, so a product without a screenshot
   still reads as a distinct tile rather than an empty box. Same
   palette as the rest of the site. */
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

function Thumbnail({ product }: { product: RoleProduct }) {
  const [failed, setFailed] = useState(false);
  const { bg, fg } = groundFor(product.id);
  const showImage = Boolean(product.thumbnail) && !failed;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-veil-gray">
      {showImage ? (
        <Image
          src={product.thumbnail as string}
          alt={`${product.name} screenshot`}
          fill
          sizes="(min-width: 1024px) 280px, 100vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        /* Same fail-soft rule as the book covers: a screenshot that
           has not been taken yet, or a path with a typo, degrades to
           this rather than to a broken-image glyph. */
        <div
          className="flex h-full w-full items-end p-16"
          style={{ backgroundColor: bg, color: fg }}
        >
          <span className="text-[15px] leading-subheading tracking-subheading">
            {product.name}
          </span>
        </div>
      )}
    </div>
  );
}

function Badge({ badge }: { badge: NonNullable<RoleProduct["badge"]> }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  /* Height-constrained, width auto: award badges are wide and vary in
     ratio, and Product Hunt's is much wider than it is tall. */
  const image = (
    <Image
      src={badge.src}
      alt={badge.alt}
      width={500}
      height={108}
      className="h-32 w-auto"
      onError={() => setFailed(true)}
    />
  );

  return badge.href ? (
    <Link
      href={badge.href}
      target="_blank"
      rel="noreferrer noopener"
      className="shrink-0 transition-opacity hover:opacity-80"
    >
      {image}
    </Link>
  ) : (
    <span className="shrink-0">{image}</span>
  );
}

function Facts({ product }: { product: RoleProduct }) {
  const rows = [
    { label: "TARGET ICP", value: product.icp },
    { label: "TARGET MARKET", value: product.market },
    { label: "KEY HIGHLIGHT", value: product.highlight },
  ];

  return (
    <dl className="mt-16 flex flex-col gap-12">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-4 sm:flex-row sm:gap-16">
          <dt className="label shrink-0 text-smoke-gray sm:w-[140px]">
            {row.label}
          </dt>
          <dd className="text-caption leading-caption tracking-caption text-ink-black">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Full-screen detail. Escape closes it and the page behind is held still. */
function DetailModal({
  product,
  company,
  onClose,
}: {
  product: RoleProduct;
  company: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} in detail`}
      className="fixed inset-0 z-[60] overflow-y-auto bg-paper-white"
    >
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-24 pb-56 pt-24 sm:px-40">
        <div className="flex items-start justify-between gap-24">
          <div className="min-w-0">
            <p className="label text-smoke-gray">
              <CasedLabel>{company}</CasedLabel>
            </p>
            <h2 className="mt-12 text-[24px] leading-heading tracking-heading text-ink-black sm:text-heading">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="label link-underline shrink-0 text-ink-black"
          >
            CLOSE
          </button>
        </div>

        <div className="mt-40 grid gap-40 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-24">
            {product.detail.map((paragraph, index) => (
              <p
                key={index}
                className="max-w-[680px] text-body leading-body tracking-body text-ink-black"
              >
                {paragraph}
              </p>
            ))}

            {product.href && (
              <Link
                href={product.href}
                target="_blank"
                rel="noreferrer noopener"
                className="label link-underline self-start text-ink-black"
              >
                VISIT {product.name.toUpperCase()}
              </Link>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Thumbnail product={product} />
            <Facts product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoleShowcase({
  role,
  defaultOpen = false,
}: {
  role: Role;
  /** The first role opens on load; see the note on <details> below. */
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<RoleProduct | null>(null);

  return (
    <>
      {/* Native <details>, the same idiom the timeline uses: no JS
          needed to open it, keyboard operable, and it survives a page
          print. The first role is open on load so the fold is not a
          row of shut boxes; the rest start closed so the page is
          skimmable in one screen. */}
      <details
        open={defaultOpen}
        className="group rounded-card border border-veil-gray"
      >
        <summary className="flex cursor-pointer list-none items-start gap-16 p-24 sm:p-40 [&::-webkit-details-marker]:hidden">
          {/* 67px: 40% up from the 48px chip used elsewhere. Arbitrary
              value rather than `size-67`, because 67 is not one of the
              declared spacing steps and would fall through to
              Tailwind's own scale. */}
          {role.logo && (
            <div className="size-[67px] shrink-0 overflow-hidden rounded-2xl bg-ink-black">
              <Image
                src={role.logo}
                alt=""
                width={256}
                height={256}
                className="size-full object-cover"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            {/* Uppercased in CSS, not in the data: the DOM keeps
                "NodeOps" and "BlueUrbn" with their real casing, so
                copy-paste, search and screen readers get the name as
                written while the heading reads as a caps treatment. */}
            <h2 className="text-subheading uppercase leading-subheading tracking-subheading text-ink-black">
              {role.href ? (
                <Link
                  href={role.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline"
                >
                  {role.company}
                </Link>
              ) : (
                role.company
              )}
            </h2>
            <p className="label mt-8 text-smoke-gray">
              <CasedLabel>{role.role}</CasedLabel>
            </p>
            <p className="label mt-4 text-smoke-gray">
              {role.period}
              {role.context ? ` · ${role.context}` : ""}
            </p>
          </div>

          {/* Rotates into a cross when open. */}
          <span
            aria-hidden="true"
            className="shrink-0 text-subheading leading-none text-smoke-gray transition-transform duration-200 group-open:rotate-45"
          >
            +
          </span>
        </summary>

        {role.products && role.products.length > 0 && (
          <div className="px-24 pb-24 sm:px-40 sm:pb-40">
            <ul className="flex flex-col border-t border-veil-gray pt-32">
              {role.products.map((product) => (
                <li
                  key={product.id}
                  className="border-t border-veil-gray py-32 first:border-t-0 first:pt-0"
                >
                  <div className="grid gap-24 lg:grid-cols-[280px_minmax(0,1fr)]">
                    {/* The thumbnail is the link out to the product;
                        products without a live URL show the same tile
                        without wrapping it in a dead anchor. */}
                    {product.href ? (
                      <Link
                        href={product.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`Open ${product.name}`}
                        className="block transition-opacity hover:opacity-80"
                      >
                        <Thumbnail product={product} />
                      </Link>
                    ) : (
                      <Thumbnail product={product} />
                    )}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-16">
                        <h3 className="text-subheading leading-subheading tracking-subheading text-ink-black">
                          {product.name}
                        </h3>
                        {product.badge && <Badge badge={product.badge} />}
                      </div>
                      <p className="mt-12 max-w-[640px] text-body leading-body tracking-body text-mist-gray">
                        {product.brief}
                      </p>

                      <Facts product={product} />

                      {product.skills && product.skills.length > 0 && (
                        <ul className="mt-16 flex flex-wrap gap-8">
                          {product.skills.map((skill) => (
                            <li key={skill}>
                              {/* Not the `label` utility: that
                                  uppercases, which would turn "CI/CD"
                                  and "0 to 1" into shouting and lose
                                  the casing in "GitHub Actions". */}
                              <span className="inline-block rounded-button border border-veil-gray px-8 py-4 text-caption leading-caption tracking-caption text-smoke-gray">
                                {skill}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* `aria-label` carries the product name so the
                          link is not just "VISIT" out of context -
                          screen reader users often pull the links out
                          of a page as a list, where a dozen identical
                          labels are useless. */}
                      {product.href && (
                        <p className="mt-24">
                          <Link
                            href={product.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label={`Visit ${product.name}`}
                            className="label link-underline text-ink-black"
                          >
                            VISIT
                          </Link>
                        </p>
                      )}

                      {/* Turned off on request. The button, the modal
                          and every product's `detail` copy are all
                          still here - flip READ_MORE_ENABLED back to
                          true and it returns exactly as it was. */}
                      {READ_MORE_ENABLED && (
                        <button
                          type="button"
                          onClick={() => setOpen(product)}
                          className="label mt-24 rounded-button border border-veil-gray px-16 py-8 text-ink-black transition-colors hover:border-ink-black"
                        >
                          READ MORE
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </details>

      {open && (
        <DetailModal
          product={open}
          company={role.company}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
