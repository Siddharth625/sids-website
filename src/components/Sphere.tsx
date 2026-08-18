/**
 * The gradient sphere - the site's only brand illustration.
 *
 * The spec describes this as a 3D-rendered image asset, and explicitly
 * forbids using the teal-to-violet gradient as a section background.
 * This is a faithful stand-in: a *contained* element carrying the
 * gradient, not a background on anything else. Drop a real render in
 * as an <Image> here and nothing else in the layout has to change.
 *
 * Colour path: white at the highlight → pale blue → International
 * Klein Blue → deep navy in the shadow, lit from slightly above
 * centre. Retuned off the spec's lavender-to-teal so the sphere reads
 * as the same substance as the #002fa7 accent; a lavender sphere
 * beside a Klein-blue button would look like two brands.
 */

/* Light position per variant. Repeating one sphere across every
   feature card reads as a placeholder, so each card gets its own
   lighting angle - same substance, different render. */
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
      /* No width here on purpose - the caller owns sizing. A `w-full`
         default would collide with the caller's own width utility and
         win or lose depending on CSS order. */
      className={`pointer-events-none aspect-square rounded-full ${className}`}
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, #ffffff 0%, #dee6ff 14%, #aabdf4 30%, #6e8ee5 46%, #3358cd 62%, #002fa7 78%, #01256f 90%, #011c4d 100%)`,
      }}
    />
  );
}
