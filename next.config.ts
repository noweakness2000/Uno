import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

function git(cmd: string): string | null {
  try {
    const out = execSync(cmd, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

function shortSha(full: string): string {
  const hex = full.trim().replace(/[^0-9a-fA-F]/g, "");
  return hex.slice(0, 7).toLowerCase();
}

/** Read HEAD from a partial .git copy. Never throws. */
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
  return git("git rev-parse --short HEAD") ?? shaFromGitDir(process.cwd()) ?? "dev";
}

/** v0.XXX from commit count; "dev" if git history is missing or shallow. */
function resolveAppVersion(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_VERSION?.trim();
  if (fromEnv) return fromEnv;
  if (existsSync(join(process.cwd(), ".git", "shallow"))) return "dev";
  const raw = git("git rev-list --count HEAD");
  if (!raw) return "dev";
  const count = Number.parseInt(raw, 10);
  if (!Number.isFinite(count) || count < 0) return "dev";
  return `0.${String(count).padStart(3, "0")}`;
}

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_APP_VERSION: resolveAppVersion(),
    NEXT_PUBLIC_GIT_SHA: resolveGitSha(),
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
