import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { getDb, hasDatabase } from "@/db";
import { users } from "@/db/schema";

const progressSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
  xp: z.number().int().min(0).optional(),
  streak: z.number().int().min(0).optional(),
  dailyGoal: z.number().int().min(1).max(500).optional(),
  dailyXp: z.number().int().min(0).optional(),
  startingLevel: z
    .enum(["absolute_beginner", "some_words", "conversational_basics"])
    .optional(),
  onboardingComplete: z.boolean().optional(),
  completedLessonIds: z.array(z.string()).optional(),
  weakWordIds: z.array(z.string()).optional(),
  skippedUnitIds: z.array(z.string()).optional(),
  recommendedUnitId: z.string().nullable().optional(),
});

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

  return NextResponse.json({
    progress: {
      id: row.id,
      name: row.displayName || row.name || "Learner",
      xp: row.xp,
      streak: row.streak,
      dailyGoal: row.dailyGoal,
      dailyXp: row.dailyXp,
      startingLevel: row.startingLevel,
      onboardingComplete: row.onboardingComplete,
      completedLessonIds: row.completedLessonIds ?? [],
      weakWordIds: row.weakWordIds ?? [],
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

  const patch = {
    displayName: incoming.displayName ?? existing.displayName,
    name: incoming.displayName ?? existing.name,
    xp: Math.max(existing.xp, incoming.xp ?? 0),
    streak: Math.max(existing.streak, incoming.streak ?? 0),
    dailyGoal: incoming.dailyGoal ?? existing.dailyGoal,
    dailyXp: Math.max(existing.dailyXp, incoming.dailyXp ?? 0),
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
      name: updated.displayName || updated.name || "Learner",
      xp: updated.xp,
      streak: updated.streak,
      dailyGoal: updated.dailyGoal,
      dailyXp: updated.dailyXp,
      startingLevel: updated.startingLevel,
      onboardingComplete: updated.onboardingComplete,
      completedLessonIds: updated.completedLessonIds ?? [],
      weakWordIds: updated.weakWordIds ?? [],
      skippedUnitIds: updated.skippedUnitIds ?? [],
      recommendedUnitId: updated.recommendedUnitId,
    },
  });
}
