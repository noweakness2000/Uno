import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { getDb, hasDatabase } from "@/db";
import { users } from "@/db/schema";
import { isPlaceholderName } from "@/lib/display-name";
import { mergeSrsCards } from "@/lib/srs";
import { mergeStreakFields } from "@/lib/streak";

const progressSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
  xp: z.number().int().min(0).optional(),
  streak: z.number().int().min(0).optional(),
  dailyGoal: z.number().int().min(1).max(500).optional(),
  dailyXp: z.number().int().min(0).optional(),
  lastStreakDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  startingLevel: z
    .enum(["absolute_beginner", "some_words", "conversational_basics"])
    .optional(),
  onboardingComplete: z.boolean().optional(),
  completedLessonIds: z.array(z.string()).optional(),
  weakWordIds: z.array(z.string()).optional(),
  srsCards: z
    .record(
      z.string(),
      z.object({
        intervalDays: z.number(),
        ease: z.number(),
        dueAt: z.string(),
        reps: z.number().int().min(0),
      })
    )
    .optional(),
  skippedUnitIds: z.array(z.string()).optional(),
  recommendedUnitId: z.string().nullable().optional(),
});

function publicName(
  displayName: string | null | undefined,
  oauthName: string | null | undefined
): string {
  if (!isPlaceholderName(displayName)) return displayName!.trim();
  if (!isPlaceholderName(oauthName)) return oauthName!.trim();
  return "Learner";
}

/**
 * Resolve displayName for a progress write:
 * - Real custom incoming names win.
 * - Placeholders never overwrite a real DB/Google name.
 * - Seed from Google/session when displayName is null/placeholder.
 * - One-time repair: if DB was corrupted to "Learner", restore Google name.
 */
function resolveNames(opts: {
  incomingDisplayName: string | undefined;
  existingDisplayName: string | null;
  existingOauthName: string | null;
  sessionName: string | null | undefined;
}): { displayName: string | null; name: string | null } {
  const {
    incomingDisplayName,
    existingDisplayName,
    existingOauthName,
    sessionName,
  } = opts;

  const realSession =
    !isPlaceholderName(sessionName) && sessionName
      ? sessionName.trim()
      : null;
  const realOauth =
    !isPlaceholderName(existingOauthName) && existingOauthName
      ? existingOauthName.trim()
      : realSession;
  const realExistingDisplay =
    !isPlaceholderName(existingDisplayName) && existingDisplayName
      ? existingDisplayName.trim()
      : null;
  const realIncoming =
    incomingDisplayName !== undefined &&
    !isPlaceholderName(incomingDisplayName)
      ? incomingDisplayName.trim()
      : null;

  let displayName: string | null;
  if (realIncoming) {
    displayName = realIncoming;
  } else if (realExistingDisplay) {
    displayName = realExistingDisplay;
  } else if (realOauth) {
    // First sync seed + one-time Learner repair
    displayName = realOauth;
  } else if (incomingDisplayName !== undefined) {
    displayName = incomingDisplayName.trim() || null;
  } else {
    displayName = existingDisplayName;
  }

  // Never let a placeholder clobber Auth.js/Google `name`. Repair if needed.
  let name = existingOauthName;
  if (isPlaceholderName(name) && realSession) {
    name = realSession;
  }

  return { displayName, name };
}

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // One-time repair on read path if DB still has Learner but session has Google name.
  const sessionName = session.user.name;
  if (
    (isPlaceholderName(row.displayName) || isPlaceholderName(row.name)) &&
    !isPlaceholderName(sessionName) &&
    sessionName
  ) {
    const repaired = resolveNames({
      incomingDisplayName: undefined,
      existingDisplayName: row.displayName,
      existingOauthName: row.name,
      sessionName,
    });
    const [updated] = await db
      .update(users)
      .set({
        displayName: repaired.displayName,
        name: repaired.name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json({
      progress: {
        id: updated.id,
        name: publicName(updated.displayName, updated.name),
        xp: updated.xp,
        streak: updated.streak,
        dailyGoal: updated.dailyGoal,
        dailyXp: updated.dailyXp,
        lastStreakDate: updated.lastStreakDate,
        startingLevel: updated.startingLevel,
        onboardingComplete: updated.onboardingComplete,
        completedLessonIds: updated.completedLessonIds ?? [],
        weakWordIds: updated.weakWordIds ?? [],
        srsCards: updated.srsCards ?? {},
        skippedUnitIds: updated.skippedUnitIds ?? [],
        recommendedUnitId: updated.recommendedUnitId,
      },
    });
  }

  return NextResponse.json({
    progress: {
      id: row.id,
      name: publicName(row.displayName, row.name),
      xp: row.xp,
      streak: row.streak,
      dailyGoal: row.dailyGoal,
      dailyXp: row.dailyXp,
      lastStreakDate: row.lastStreakDate,
      startingLevel: row.startingLevel,
      onboardingComplete: row.onboardingComplete,
      completedLessonIds: row.completedLessonIds ?? [],
      weakWordIds: row.weakWordIds ?? [],
      srsCards: row.srsCards ?? {},
      skippedUnitIds: row.skippedUnitIds ?? [],
      recommendedUnitId: row.recommendedUnitId,
    },
  });
}

/** Merge local demo progress into DB (best-effort max/union). */
export async function PUT(req: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = progressSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  const db = getDb();
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const incoming = parsed.data;
  const mergeIds = (a: string[] = [], b: string[] = []) =>
    Array.from(new Set([...a, ...b]));

  const { displayName, name } = resolveNames({
    incomingDisplayName: incoming.displayName,
    existingDisplayName: existing.displayName,
    existingOauthName: existing.name,
    sessionName: session.user.name,
  });

  const patch = {
    displayName,
    name,
    xp: Math.max(existing.xp, incoming.xp ?? 0),
    dailyGoal: incoming.dailyGoal ?? existing.dailyGoal,
    ...mergeStreakFields(
      {
        streak: existing.streak,
        dailyXp: existing.dailyXp,
        lastStreakDate: existing.lastStreakDate,
      },
      {
        streak: incoming.streak ?? existing.streak,
        dailyXp: incoming.dailyXp ?? existing.dailyXp,
        lastStreakDate:
          incoming.lastStreakDate !== undefined
            ? incoming.lastStreakDate
            : existing.lastStreakDate,
      }
    ),
    startingLevel: incoming.startingLevel ?? existing.startingLevel,
    onboardingComplete:
      existing.onboardingComplete || Boolean(incoming.onboardingComplete),
    completedLessonIds: mergeIds(
      existing.completedLessonIds ?? [],
      incoming.completedLessonIds ?? []
    ),
    weakWordIds: mergeIds(
      existing.weakWordIds ?? [],
      incoming.weakWordIds ?? []
    ),
    srsCards: mergeSrsCards(
      (existing.srsCards as Record<string, { intervalDays: number; ease: number; dueAt: string; reps: number }> | null) ?? {},
      incoming.srsCards ?? {}
    ),
    skippedUnitIds: mergeIds(
      existing.skippedUnitIds ?? [],
      incoming.skippedUnitIds ?? []
    ),
    recommendedUnitId:
      incoming.recommendedUnitId !== undefined
        ? incoming.recommendedUnitId
        : existing.recommendedUnitId,
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(users)
    .set(patch)
    .where(eq(users.id, session.user.id))
    .returning();

  return NextResponse.json({
    progress: {
      id: updated.id,
      name: publicName(updated.displayName, updated.name),
      xp: updated.xp,
      streak: updated.streak,
      dailyGoal: updated.dailyGoal,
      dailyXp: updated.dailyXp,
      lastStreakDate: updated.lastStreakDate,
      startingLevel: updated.startingLevel,
      onboardingComplete: updated.onboardingComplete,
      completedLessonIds: updated.completedLessonIds ?? [],
      weakWordIds: updated.weakWordIds ?? [],
      srsCards: updated.srsCards ?? {},
      skippedUnitIds: updated.skippedUnitIds ?? [],
      recommendedUnitId: updated.recommendedUnitId,
    },
  });
}
