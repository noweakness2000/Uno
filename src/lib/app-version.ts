/** Baked at build time from next.config.ts. */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
export const GIT_SHA = process.env.NEXT_PUBLIC_GIT_SHA ?? "dev";

/** Public footer, e.g. "v0.053". */
export const APP_VERSION_SHORT =
  APP_VERSION === "dev" ? "dev" : `v${APP_VERSION}`;

/** Diagnostic /version label, e.g. "v0.053 · 2f0059f". */
export const APP_VERSION_LABEL =
  APP_VERSION === "dev"
    ? GIT_SHA === "dev"
      ? "dev"
      : `dev · ${GIT_SHA}`
    : `v${APP_VERSION} · ${GIT_SHA}`;
