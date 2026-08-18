/**
 * Soft grainy mesh gradient for the hero background.
 *
 * Built from overlapping radial gradients rather than an image, so it
 * scales to any viewport without a large asset and stays crisp on
 * retina. Three things make it read as the reference rather than as a
 * flat CSS gradient:
 *
 *   1. the layer is inset beyond the container and blurred, so the
 *      blobs smear into each other instead of showing clean ellipse
 *      edges (the blur is why it's inset - otherwise the blur would
 *      feather the container's own edges and show seams)
 *   2. a film-grain overlay from an inline SVG feTurbulence, which
 *      breaks up the banding that large soft gradients produce on
 *      8-bit displays
 *   3. a mask that fades the whole thing out at the bottom, so the
 *      hero dissolves into the white canvas rather than ending on a
 *      hard line
 *
 * Every hue is drawn from the Klein blue accent family - this stays
 * an almost achromatic page with one colour in it.
 */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* The hero sits at the top of the page, so its gradient fades out at
   the bottom into the white canvas. A section further down needs the
   fade at the *top* instead, or the colour starts on a hard horizontal
   edge - hence `flip`, which just runs the mask the other way. */
const FADE_DOWN =
  "linear-gradient(180deg, #000 0%, #000 58%, rgba(0,0,0,0.55) 80%, transparent 100%)";
const FADE_UP =
  "linear-gradient(0deg, #000 0%, #000 58%, rgba(0,0,0,0.55) 80%, transparent 100%)";

export default function MeshGradient({ flip = false }: { flip?: boolean }) {
  const mask = flip ? FADE_UP : FADE_DOWN;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {/* Colour field. Inset past the edges so the blur has room. */}
      <div
        className="absolute -inset-[20%]"
        style={{
          filter: "blur(58px)",
          background: [
            /* The one saturated smear. Kept over the open left/centre
               rather than the upper right - the profile card occupies
               the right half and would hide the only strong colour on
               the page. */
            "radial-gradient(30% 26% at 30% 20%, rgba(0,47,167,0.55) 0%, rgba(0,47,167,0) 64%)",
            "radial-gradient(26% 20% at 44% 30%, rgba(0,47,167,0.34) 0%, rgba(0,47,167,0) 62%)",
            "radial-gradient(22% 18% at 20% 12%, rgba(0,47,167,0.30) 0%, rgba(0,47,167,0) 60%)",
            // broad pale washes
            "radial-gradient(50% 42% at 8% 44%, rgba(108,160,224,0.60) 0%, rgba(108,160,224,0) 70%)",
            "radial-gradient(44% 38% at 26% 78%, rgba(132,180,236,0.52) 0%, rgba(132,180,236,0) 72%)",
            "radial-gradient(56% 44% at 66% 66%, rgba(160,200,242,0.46) 0%, rgba(160,200,242,0) 74%)",
            "radial-gradient(40% 34% at 88% 14%, rgba(120,168,228,0.44) 0%, rgba(120,168,228,0) 70%)",
            // warm lift in the middle, as in the reference
            "radial-gradient(22% 18% at 40% 46%, rgba(236,230,212,0.60) 0%, rgba(236,230,212,0) 72%)",
            // base
            "linear-gradient(180deg, #dfeafa 0%, #eef4fd 58%, #ffffff 100%)",
          ].join(","),
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.34] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat" }}
      />
    </div>
  );
}
