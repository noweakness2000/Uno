"use client";

import Link from "next/link";
import { BookMarked, Layers, Trophy } from "lucide-react";
import { countDue } from "@/lib/srs";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

/**
 * Practice shortcuts as a 3-up row.
 *
 * These live here on phone and tablet only because there is no room for
 * persistent navigation; at lg they are replaced by the sidebar rail.
 */
export function QuickActions() {
  const user = useUserStore((s) => s.user);
  const weakCount = user.weakWordIds.length;
  const dueCount = countDue(user.srsCards);

  const tiles = [
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      badge: null as string | null,
      tint: "hover:border-violet-200",
      iconTint: "bg-violet-50 text-violet-600",
      badgeTint: "bg-violet-100 text-violet-700",
    },
    {
      href: "/flashcards",
      label: "Cards",
      icon: Layers,
      badge: dueCount > 0 ? String(dueCount) : null,
      tint: "hover:border-sky-200",
      iconTint: "bg-sky-50 text-sky-600",
      badgeTint: "bg-sky-100 text-sky-700",
    },
    {
      href: "/review",
      label: "Review",
      icon: BookMarked,
      badge: weakCount > 0 ? String(weakCount) : null,
      tint: "hover:border-rose-200",
      iconTint: "bg-rose-50 text-rose-600",
      badgeTint: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <nav aria-label="Practice shortcuts" className="grid grid-cols-3 gap-2.5">
      {tiles.map(({ href, label, icon: Icon, badge, tint, iconTint, badgeTint }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "relative flex min-h-[5.25rem] flex-col items-center justify-center gap-2 rounded-2xl",
            "border-2 border-slate-200 bg-white p-3 shadow-sm transition-all",
            "hover:-translate-y-0.5 hover:shadow-md",
            tint
          )}
        >
          {badge && (
            <span
              className={cn(
                "absolute right-1.5 top-1.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full",
                "border-2 border-white px-1.5 text-[11px] font-extrabold tabular-nums",
                badgeTint
              )}
            >
              {badge}
            </span>
          )}
          <span
            className={cn("grid h-9 w-9 place-items-center rounded-xl", iconTint)}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </span>
          <span className="text-[11.5px] font-bold text-slate-700">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
