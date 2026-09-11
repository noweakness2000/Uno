import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/** Auth.js users + optional Uno progress fields. */
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  /** Display name shown in the app (may differ from OAuth name). */
  displayName: text("displayName"),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  dailyGoal: integer("dailyGoal").notNull().default(20),
  dailyXp: integer("dailyXp").notNull().default(0),
  lastStreakDate: text("lastStreakDate"),
  startingLevel: text("startingLevel").notNull().default("absolute_beginner"),
  onboardingComplete: boolean("onboardingComplete").notNull().default(false),
  completedLessonIds: jsonb("completedLessonIds")
    .$type<string[]>()
    .notNull()
    .default([]),
  weakWordIds: jsonb("weakWordIds").$type<string[]>().notNull().default([]),
  srsCards: jsonb("srsCards").$type<Record<string, { intervalDays: number; ease: number; dueAt: string; reps: number }>>().notNull().default({}),
  skippedUnitIds: jsonb("skippedUnitIds").$type<string[]>().notNull().default([]),
  recommendedUnitId: text("recommendedUnitId"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
