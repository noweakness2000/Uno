/** Baked at build time from next.config.ts. */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.4";
export const GIT_SHA = process.env.NEXT_PUBLIC_GIT_SHA ?? "dev";

/** Footer label, e.g. "v 0.4 · 647d0d8". */
export const APP_VERSION_LABEL = `v ${APP_VERSION} · ${GIT_SHA}`;
