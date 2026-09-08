/** Accent-insensitive answer normalization for grading. */
export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[¡!¿?.,;:"'`´]/g, "")
    .replace(/\s+/g, " ");
}

/** Compare two free-text answers after normalization. */
export function answersMatch(a: string, b: string): boolean {
  return normalizeAnswer(a) === normalizeAnswer(b);
}

/** Compare chip sequences with per-chip normalization. */
export function chipSequencesMatch(
  built: string[],
  correctOrder: string[]
): boolean {
  if (built.length !== correctOrder.length) return false;
  return built.every((w, i) => answersMatch(w, correctOrder[i]));
}
