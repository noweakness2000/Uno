/**
 * Node ESM resolve hook so `node --experimental-strip-types` can import the
 * app's TypeScript modules directly: maps the `@/` alias to `src/` and adds
 * `.ts` / `.tsx` / `/index.ts` to extensionless relative imports. Used by
 * scripts that must run in the Docker build, where only Node is available.
 *
 *   node --experimental-strip-types --import ./scripts/register-ts-alias.mjs scripts/foo.ts
 */
import { existsSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = resolvePath(dirname(fileURLToPath(import.meta.url)), "..", "src");

function withExtension(base) {
  if (/\.[cm]?[jt]sx?$/.test(base) && existsSync(base)) return base;
  for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    if (existsSync(base + ext)) return base + ext;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  let base = null;
  if (specifier.startsWith("@/")) {
    base = resolvePath(SRC, specifier.slice(2));
  } else if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    context.parentURL?.startsWith("file:")
  ) {
    base = resolvePath(dirname(fileURLToPath(context.parentURL)), specifier);
  }
  if (base) {
    const target = withExtension(base);
    if (target) return { url: pathToFileURL(target).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
