/** Default / demo placeholders that should yield to Google/session names. */
const PLACEHOLDER_NAMES = new Set([
  "learner",
  "guest",
  "user",
  "anonymous",
  "demo",
]);

/** True when the name is empty or a known onboarding/demo placeholder. */
export function isPlaceholderName(value: string | null | undefined): boolean {
  if (value == null) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  return PLACEHOLDER_NAMES.has(trimmed.toLowerCase());
}

/**
 * Prefer a real custom/local name; otherwise prefer session/Google.
 * Used on auth sync so Zustand does not keep "Learner" after Google sign-in.
 */
export function preferRealName(
  localName: string | null | undefined,
  sessionName: string | null | undefined
): string {
  if (!isPlaceholderName(localName)) return localName!.trim();
  if (!isPlaceholderName(sessionName)) return sessionName!.trim();
  return (localName ?? "").trim() || "Learner";
}
