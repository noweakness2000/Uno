import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

/** Product version — bump by hand when you want a new 0.x. Git SHA is appended at build. */
const APP_RELEASE = "0.4";

function shortSha(full: string): string {
  const hex = full.trim().replace(/[^0-9a-fA-F]/g, "");
  return hex.slice(0, 7).toLowerCase();
}

/** Read HEAD from a partial .git copy (Docker omits objects). Never throws. */
function shaFromGitDir(root: string): string | null {
  const gitDir = join(root, ".git");
  const headPath = join(gitDir, "HEAD");
  if (!existsSync(headPath)) return null;
  try {
    const head = readFileSync(headPath, "utf8").trim();
    if (/^[0-9a-f]{40,}$/i.test(head)) return shortSha(head);
    const ref = head.replace(/^ref:\s+/, "").trim();
    if (!ref) return null;
    const refPath = join(gitDir, ...ref.split("/"));
    if (existsSync(refPath)) {
      return shortSha(readFileSync(refPath, "utf8"));
    }
    const packedPath = join(gitDir, "packed-refs");
    if (!existsSync(packedPath)) return null;
    for (const line of readFileSync(packedPath, "utf8").split("\n")) {
      if (!line || line.startsWith("#") || line.startsWith("^")) continue;
      const [sha, name] = line.split(/\s+/);
      if (name === ref && sha) return shortSha(sha);
    }
  } catch {
    return null;
  }
  return null;
}

function resolveGitSha(): string {
  const fromEnv = process.env.NEXT_PUBLIC_GIT_SHA?.trim();
  if (fromEnv) return fromEnv;
  try {
    const sha = execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (sha) return sha;
  } catch {
    // No git binary, shallow/missing history, or not a repo.
  }
  return shaFromGitDir(process.cwd()) ?? "dev";
}

const gitSha = resolveGitSha();

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_APP_VERSION: APP_RELEASE,
    NEXT_PUBLIC_GIT_SHA: gitSha,
  },
  async headers() {
    return [
      {
        source: "/api/auth/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, no-cache, max-age=0, must-revalidate",
          },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
