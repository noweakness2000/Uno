"use client";

import Link from "next/link";
import { BookMarked, RotateCcw } from "lucide-react";
import { StatsBar } from "@/components/home/stats-bar";
import { UnitPath } from "@/components/home/unit-path";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";

export default function HomePage() {
  const user = useUserStore((s) => s.user);
  const resetDemo = useUserStore((s) => s.resetDemo);
  const weakCount = user.weakWordIds.length;

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 pb-16 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Uno
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Hola, {user.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/review">
            <Button variant="soft" size="sm">
              <BookMarked className="h-4 w-4" />
              Review
              {weakCount > 0 && (
                <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] text-white">
                  {weakCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </header>

      <StatsBar />

      <div className="my-8">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Your path</h2>
        <UnitPath />
      </div>

      <button
        type="button"
        onClick={() => {
          resetDemo();
          window.location.href = "/onboarding";
        }}
        className="mx-auto flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600"
      >
        <RotateCcw className="h-3 w-3" />
        Reset demo progress
      </button>
    </div>
  );
}
