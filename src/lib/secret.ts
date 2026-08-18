/**
 * Read a secret from the environment, defensively.
 *
 * Values pasted into a hosting dashboard routinely arrive wrapped in
 * the quotes someone copied along with them, or with a trailing
 * newline from the clipboard. Both make an otherwise-valid key fail
 * authentication, and the failure looks identical to a wrong key -
 * which is a genuinely miserable thing to debug through a provider's
 * 401. Strip them here rather than hoping nobody ever pastes badly.
 */
export function readSecret(name: string) {
  const raw = process.env[name];
  if (!raw) return "";
  return raw.trim().replace(/^['"]|['"]$/g, "").trim();
}
