import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema";
import { isPlaceholderName } from "@/lib/display-name";

/** True when Google OAuth env is present (non-placeholder). */
export function isGoogleAuthConfigured() {
  const id = process.env.AUTH_GOOGLE_ID?.trim();
  const secret = process.env.AUTH_GOOGLE_SECRET?.trim();
  if (!id || !secret) return false;
  if (id === "unset" || secret === "unset") return false;
  if (id.includes("YOUR_") || secret.includes("YOUR_")) return false;
  return true;
}

const providers = [];

if (isGoogleAuthConfigured()) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  adapter: hasDatabase()
    ? DrizzleAdapter(getDb(), {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      })
    : undefined,
  session: {
    strategy: hasDatabase() ? "database" : "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers,
  events: {
    /**
     * One-time repair: if a prior bug wrote "Learner" over Auth.js/Google name,
     * restore from the fresh Google profile on sign-in.
     */
    async signIn({ user, profile }) {
      if (!hasDatabase() || !user?.id) return;
      const googleName =
        (typeof profile?.name === "string" && profile.name.trim()) ||
        null;
      if (isPlaceholderName(googleName) || !googleName) return;

      const db = getDb();
      const [row] = await db
        .select({
          name: users.name,
          displayName: users.displayName,
        })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      if (!row) return;

      const patch: {
        name?: string;
        displayName?: string | null;
        updatedAt: Date;
      } = { updatedAt: new Date() };
      let dirty = false;

      if (isPlaceholderName(row.name)) {
        patch.name = googleName;
        dirty = true;
      }
      if (isPlaceholderName(row.displayName)) {
        patch.displayName = googleName;
        dirty = true;
      }
      if (!dirty) return;

      await db.update(users).set(patch).where(eq(users.id, user.id));
    },
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id ?? token?.sub ?? "";
      }
      return session;
    },
  },
});
