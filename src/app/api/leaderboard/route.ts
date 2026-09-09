import { NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb, hasDatabase } from "@/db";
import { accounts, users } from "@/db/schema";
import { isPlaceholderName } from "@/lib/display-name";

const LIMIT = 50;

function publicDisplayName(
  displayName: string | null | undefined,
  oauthName: string | null | undefined
): string {
  if (!isPlaceholderName(displayName)) return displayName!.trim();
  if (!isPlaceholderName(oauthName)) return oauthName!.trim();
  return "Learner";
}

/**
 * Public leaderboard — Google OAuth users only (join accounts.provider = google).
 * Demo/local/anonymous never appear. No emails or secrets. Motivational only.
 */
export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Database unavailable", entries: [], meId: null },
      { status: 503 }
    );
  }

  const session = await auth();
  const meId = session?.user?.id ?? null;

  const db = getDb();
  const rows = await db
    .selectDistinct({
      id: users.id,
      displayName: users.displayName,
      name: users.name,
      xp: users.xp,
      streak: users.streak,
    })
    .from(users)
    .innerJoin(accounts, eq(accounts.userId, users.id))
    .where(
      and(
        eq(accounts.provider, "google"),
        sql`(${users.onboardingComplete} = true OR ${users.xp} > 0)`
      )
    )
    .orderBy(desc(users.xp), desc(users.streak))
    .limit(LIMIT);

  const entries = rows.map((row, index) => ({
    rank: index + 1,
    id: row.id,
    name: publicDisplayName(row.displayName, row.name),
    xp: row.xp,
    streak: row.streak,
    isMe: meId != null && row.id === meId,
  }));

  return NextResponse.json({ entries, meId, limit: LIMIT });
}
