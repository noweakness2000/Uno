"use client";

import { useState } from "react";
import Link from "next/link";
import { BookMarked, Pencil, RotateCcw } from "lucide-react";
import { StatsBar } from "@/components/home/stats-bar";
import { UnitPath } from "@/components/home/unit-path";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";

export default function HomePage() {
  const user = useUserStore((s) => s.user);
  const resetDemo = useUserStore((s) => s.resetDemo);
  const updateName = useUserStore((s) => s.updateName);
  const weakCount = user.weakWordIds.length;
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.name);

  const saveName = () => {
    updateName(draftName);
    setEditing(false);
  };

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 pb-16 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Uno
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Hola, {user.name || "Learner"}
          </h1>
          <button
            type="button"
            onClick={() => {
              setDraftName(user.name);
              setEditing((v) => !v);
            }}
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-emerald-600"
          >
            <Pencil className="h-3 w-3" />
            Edit profile
          </button>
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

      {editing && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Display name
          </label>
          <input
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border-2 border-slate-200 px-3 text-base outline-none focus:border-emerald-400"
            maxLength={40}
            autoFocus
          />
          <div className="mt-3 flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={saveName}>
              Save
            </Button>
          </div>
        </div>
      )}

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
