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

/** Classic Levenshtein edit distance. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

/** Max allowed edit distance for a near-miss vs an accepted answer of length `len`. */
function nearMissThreshold(len: number): number {
  if (len <= 0) return 0;
  if (len <= 4) return 1;
  // Medium: ≤2; longer: ~20% of length, capped at 3
  return Math.min(3, Math.max(2, Math.ceil(len * 0.2)));
}

function isNearMissAgainst(userNorm: string, acceptedNorm: string): boolean {
  if (!userNorm || !acceptedNorm) return false;
  if (userNorm === acceptedNorm) return false;

  const dist = levenshtein(userNorm, acceptedNorm);
  const threshold = nearMissThreshold(acceptedNorm.length);
  if (dist > 0 && dist <= threshold) return true;

  // Same token count, exactly one token off by ≤2 edits
  const userTokens = userNorm.split(" ").filter(Boolean);
  const acceptedTokens = acceptedNorm.split(" ").filter(Boolean);
  if (userTokens.length !== acceptedTokens.length || userTokens.length === 0) {
    return false;
  }

  let differing = 0;
  for (let i = 0; i < userTokens.length; i++) {
    if (userTokens[i] === acceptedTokens[i]) continue;
    differing += 1;
    if (differing > 1) return false;
    if (levenshtein(userTokens[i], acceptedTokens[i]) > 2) return false;
  }
  return differing === 1;
}

/**
 * True when the answer is not an exact match but close enough for a soft retry
 * ("Close, but not quite."). Empty / unrelated answers are never near-misses.
 */
export function isNearMiss(
  user: string,
  acceptedAnswers: string[]
): boolean {
  const userNorm = normalizeAnswer(user);
  if (!userNorm) return false;
  if (!acceptedAnswers.length) return false;
  if (acceptedAnswers.some((a) => normalizeAnswer(a) === userNorm)) {
    return false;
  }

  return acceptedAnswers.some((a) =>
    isNearMissAgainst(userNorm, normalizeAnswer(a))
  );
}

/**
 * Soft near-miss for tap-chips: same length, exactly one chip position wrong
 * (others match after normalization). Empty / length mismatch → not near-miss.
 */
export function isChipNearMiss(
  built: string[],
  correctOrder: string[]
): boolean {
  if (built.length === 0) return false;
  if (built.length !== correctOrder.length) return false;
  if (chipSequencesMatch(built, correctOrder)) return false;

  let differing = 0;
  for (let i = 0; i < built.length; i++) {
    if (answersMatch(built[i], correctOrder[i])) continue;
    differing += 1;
    if (differing > 1) return false;
  }
  return differing === 1;
}
