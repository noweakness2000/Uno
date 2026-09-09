"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Flame, LogIn, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { flushProgressToServer } from "@/components/auth/progress-sync";

type Entry = {
  rank: number;
  id: string;
  name: string;
  xp: number;
  streak: number;
  isMe: boolean;
};

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Push local XP/streak before reading the board so ranks are fresh.
        if (status === "authenticated" && session?.user?.id) {
          await flushProgressToServer({
            sessionName: session.user.name,
          });
        }
        if (cancelled) return;

        const res = await fetch("/api/leaderboard");
        if (res.status === 503) {
          if (!cancelled) {
            setUnavailable(true);
            setEntries([]);
          }
          return;
        }
        if (!res.ok) {
          if (!cancelled) setError("Could not load leaderboard.");
          return;
        }
        const data = (await res.json()) as { entries?: Entry[] };
        if (!cancelled) {
          setUnavailable(false);
          setEntries(data.entries ?? []);
        }
      } catch {
        if (!cancelled) setError("Could not load leaderboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, session?.user?.name, status]);

  const signedIn = status === "authenticated" && Boolean(session?.user);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-4">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/home">
          <Button variant="ghost" size="icon" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Leaderboard</h1>
          <p className="text-sm text-slate-500">
            Google sign-in · XP + streak · never locks lessons
          </p>
        </div>
        <Trophy className="h-5 w-5 text-amber-500" />
      </div>

      {unavailable ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Trophy className="h-7 w-7" />
            </div>
            <p className="font-bold text-slate-800">Sign in with Google to join</p>
            <p className="max-w-xs text-sm text-slate-500">
              The board only lists Google-signed-in learners. Demo progress stays
              on this device and never appears here — still optional, still no
              lockouts.
            </p>
            <Link href="/login" className="mt-2 w-full max-w-xs">
              <Button className="w-full min-h-11" size="lg">
                <LogIn className="h-4 w-4" />
                Sign in with Google
              </Button>
            </Link>
            <Link href="/home" className="w-full max-w-xs">
              <Button variant="secondary" className="w-full" size="lg">
                Back to path
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : loading ? (
        <p className="py-12 text-center text-sm text-slate-500">Loading ranks…</p>
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-rose-700">
            {error}
          </CardContent>
        </Card>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Trophy className="h-8 w-8 text-slate-300" />
            <p className="font-bold text-slate-800">No ranks yet</p>
            <p className="max-w-xs text-sm text-slate-500">
              Sign in with Google, sync XP, and climb the board. Demo/local
              progress never appears — pure motivation, lessons stay open.
            </p>
            {!signedIn && (
              <Link href="/login" className="mt-2">
                <Button variant="soft" size="sm">
                  <LogIn className="h-4 w-4" />
                  Sign in with Google to join
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {!signedIn && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Viewing the board ·{" "}
              <Link href="/login" className="font-bold underline">
                sign in with Google
              </Link>{" "}
              to join (demo never ranks).
            </div>
          )}
          <div className="mb-3 grid grid-cols-[2.5rem_1fr_auto_auto] gap-2 px-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
            <span>#</span>
            <span>Name</span>
            <span className="text-right">XP</span>
            <span className="text-right">Streak</span>
          </div>
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id}>
                <div
                  className={cn(
                    "grid grid-cols-[2.5rem_1fr_auto_auto] items-center gap-2 rounded-2xl border px-3 py-3",
                    entry.isMe
                      ? "border-emerald-400 bg-emerald-50 shadow-sm"
                      : "border-slate-200 bg-white"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-extrabold tabular-nums",
                      entry.rank <= 3 ? "text-amber-600" : "text-slate-500"
                    )}
                  >
                    {entry.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {entry.name}
                      {entry.isMe ? (
                        <span className="ml-1 text-xs font-semibold text-emerald-700">
                          (you)
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <span className="text-right text-sm font-bold tabular-nums text-emerald-700">
                    {entry.xp.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center justify-end gap-0.5 text-right text-sm font-semibold tabular-nums text-orange-600">
                    <Flame className="h-3.5 w-3.5" />
                    {entry.streak}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs text-slate-400">
            Google sign-ins only · top {entries.length} · XP first, then streak
          </p>
        </>
      )}
    </div>
  );
}
