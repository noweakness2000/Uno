/** Baked at build time from next.config.ts. */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
export const GIT_SHA = process.env.NEXT_PUBLIC_GIT_SHA ?? "dev";

/** Diagnostic label, e.g. "v0.647 · 647d0d8". */
export const APP_VERSION_LABEL =
  APP_VERSION === "dev"
    ? GIT_SHA === "dev"
      ? "dev"
      : `dev · ${GIT_SHA}`
    : `v${APP_VERSION} · ${GIT_SHA}`;
