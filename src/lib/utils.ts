import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Display form of an answer/option: without its sentence-final period.
 * Grading (normalizeAnswer) and audio slugs already ignore punctuation, so
 * this is cosmetic only — never feed the result back into matching.
 */
export function stripTrailingPeriod(text: string): string {
  return text.replace(/\.$/, "");
}
