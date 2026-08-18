/**
 * Briefcase mark, drawn rather than shipped as a file.
 *
 * Used where an entry stands for work but has no company logo to show:
 * the Internships group header, and the one internship whose employer
 * mark we don't have. Inline SVG because it has to sit at 22px in one
 * place and 18px in another, takes the surrounding colour, and cannot
 * 404 the way a path-referenced image can.
 */
export default function BriefcaseIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className="shrink-0 text-ink-black"
    >
      <path d="M9 3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V5h-1.5V3.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25V5H9V3.5Z" />
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3.5h-7.5v-1a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v1H3V8Z" />
      <path d="M3 13h7.5v1c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75v-1H21v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z" />
    </svg>
  );
}
