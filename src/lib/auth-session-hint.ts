/**
 * Non-secret “was signed in” hint for soft reconnect UX (iOS Home Screen / Safari).
 * Never store tokens — only display name/email + timestamp.
 */
const STORAGE_KEY = "uno.auth.sessionHint";

export type AuthSessionHint = {
  email?: string | null;
  name?: string | null;
  signedInAt: number;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readAuthSessionHint(): AuthSessionHint | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSessionHint;
    if (!parsed || typeof parsed.signedInAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeAuthSessionHint(hint: {
  email?: string | null;
  name?: string | null;
}): void {
  if (!canUseStorage()) return;
  try {
    const payload: AuthSessionHint = {
      email: hint.email ?? null,
      name: hint.name ?? null,
      signedInAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota / private mode — ignore
  }
}

export function clearAuthSessionHint(): void {
  if (!canUseStorage()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
