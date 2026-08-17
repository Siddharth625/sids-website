const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
] as const;

/**
 * Formats an ISO date as "JUL 2026".
 *
 * Deliberately avoids toLocaleDateString: that resolves against the
 * runtime's locale and timezone, which differ between the server
 * render and the browser and produce a hydration mismatch. Parsing the
 * string by hand keeps the output identical everywhere.
 */
export function formatDate(iso: string): string {
  const [year, month] = iso.split("-");
  const index = Number(month) - 1;
  const name = MONTHS[index] ?? "";
  return `${name} ${year}`;
}
