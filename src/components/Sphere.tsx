/**
 * The gradient sphere — the site's only brand illustration.
 *
 * The spec describes this as a 3D-rendered image asset, and explicitly
 * forbids using the teal-to-violet gradient as a section background.
 * This is a faithful stand-in: a *contained* element carrying the
 * gradient, not a background on anything else. Drop a real render in
 * as an <Image> here and nothing else in the layout has to change.
 *
 * Colour path: white-lavender at the top → soft blue → deep teal at
 * the bottom, lit from slightly above centre.
 */

/* Light position per variant. Repeating one sphere across every
   feature card reads as a placeholder, so each card gets its own
   lighting angle — same substance, different render. */
const LIGHTING = [
  { x: 50, y: 22 },
  { x: 32, y: 34 },
  { x: 66, y: 16 },
  { x: 44, y: 44 },
] as const;

export default function Sphere({
  className = "",
  variant = 0,
}: {
  className?: string;
  variant?: number;
}) {
  const { x, y } = LIGHTING[variant % LIGHTING.length];

  return (
    <div
      aria-hidden="true"
      /* No width here on purpose — the caller owns sizing. A `w-full`
         default would collide with the caller's own width utility and
         win or lose depending on CSS order. */
      className={`pointer-events-none aspect-square rounded-full ${className}`}
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, #ffffff 0%, #eae6ff 14%, #c9c6ff 30%, #9fb5f0 48%, #5f9ac4 66%, #2b7391 80%, #135a72 92%, #0d4557 100%)`,
      }}
    />
  );
}
