"use client";

import Image from "next/image";
import Link from "next/link";
import { Settings } from "lucide-react";
import { AudioWorkoutCard } from "@/components/home/audio-workout-card";
import { ContinueHero } from "@/components/home/continue-hero";
import { NavRail } from "@/components/home/nav-rail";
import { QuickActions } from "@/components/home/quick-actions";
import { StatusRibbon } from "@/components/home/status-ribbon";
import { UnitPath } from "@/components/home/unit-path";
import { WordOfTheDayCard } from "@/components/home/word-of-the-day-card";
import { AuthControls } from "@/components/auth/auth-controls";
import { SiteFooter } from "@/components/site-footer";
import { getPlacementBanner } from "@/lib/placement";
import { useUserStore } from "@/store/user-store";

interface HomeViewProps {
  /** Unit ids with art under public/images/units (read server-side in page.tsx). */
  unitImageIds: string[];
}

export function HomeView({ unitImageIds }: HomeViewProps) {
  const user = useUserStore((s) => s.user);

  const banner = getPlacementBanner(user);

  return (
    <div
      className={[
        "mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-4 overflow-x-hidden",
        "px-3 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]",
        "sm:max-w-2xl sm:px-4",
        "lg:grid lg:max-w-5xl lg:grid-cols-[15.5rem_minmax(0,1fr)]",
        "lg:items-start lg:gap-x-6 lg:gap-y-4 lg:px-6",
      ].join(" ")}
    >
      <NavRail />

      {/* Identity + today's status */}
      <header className="flex flex-col gap-3 rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm lg:col-start-2 lg:row-start-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <div className="flex items-center gap-3 lg:gap-3.5">
          <Link
            href="/settings"
            aria-label="Settings"
            className="shrink-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <Image
              src="/images/broto-mascot.png"
              alt="Broto mascot"
              width={65}
              height={74}
              className="h-14 w-auto object-contain animate-float sm:h-16 lg:h-[74px]"
              priority
            />
          </Link>
          <div className="min-w-0 flex-1">
            {/* Wordmark: small above the greeting on phones, full lockup at lg where the rail carries the greeting. */}
            <Image
              src="/images/broto-wordmark.png"
              alt="Broto"
              width={128}
              height={51}
              className="h-5 w-auto lg:h-[51px]"
              priority
            />
            <h1 className="mt-0.5 truncate font-greeting text-2xl font-bold text-slate-900 sm:text-[26px] lg:hidden">
              Hola, {user.name || "Learner"}
            </h1>
            <Link
              href="/settings"
              className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-emerald-600 lg:hidden"
            >
              <Settings className="h-3 w-3" />
              Settings
            </Link>
          </div>
          <div className="shrink-0 lg:hidden">
            <AuthControls />
          </div>
        </div>

        <div className="lg:rounded-2xl lg:border-2 lg:border-slate-200 lg:bg-white lg:p-4 lg:shadow-sm">
          <StatusRibbon />
        </div>


        {banner && (
          <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            {banner}
          </div>
        )}
      </header>

      {/* The anchor */}
      <div className="lg:col-start-2 lg:row-start-3">
        <ContinueHero />
      </div>

      {/* Shortcuts — the rail replaces these at lg */}
      <div className="lg:hidden">
        <QuickActions />
      </div>

      {/* Optional extras: stacked on phone, paired on tablet, sidebar at lg */}
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:items-start lg:col-start-2 lg:row-start-2">
        <WordOfTheDayCard />
        <AudioWorkoutCard />
      </div>

      <section className="lg:col-start-2 lg:row-start-4">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Your path</h2>
        <UnitPath unitImageIds={unitImageIds} />
      </section>

      <footer className="flex flex-col items-center gap-3 pt-2 lg:col-start-2 lg:row-start-5 lg:items-start">
        <SiteFooter />
      </footer>
    </div>
  );
}
