/**
 * Social glyphs as inline SVG.
 *
 * Drawn rather than shipped as image files: at 18px these need to stay
 * crisp on every display and take the surrounding text colour, which a
 * raster asset cannot do. Monochrome only, per the design system's rule
 * that icons carry no colour of their own.
 *
 * The LinkedIn and X marks are the official glyph outlines and are
 * filled; the envelope is drawn with strokes, so its weight is tuned to
 * sit alongside them rather than read lighter.
 */
export default function SocialIcon({
  name,
  className = "",
  size = 18,
}: {
  name: string;
  className?: string;
  /** Larger where the glyph carries the link on its own, with no label. */
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    className: `shrink-0 ${className}`,
  };

  if (name === "linkedin") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M18.9 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.063-6.933zm-1.29 19.491h2.039L6.486 3.24H4.298l13.312 17.404z" />
      </svg>
    );
  }

  if (name === "mail") {
    return (
      <svg
        {...common}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4.5" width="20" height="15" rx="2.5" />
        <path d="m3 7 8.15 5.6a1.5 1.5 0 0 0 1.7 0L21 7" />
      </svg>
    );
  }

  return null;
}
