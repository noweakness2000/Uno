"use client";

import Image from "next/image";
import Link from "next/link";
import { BookMarked, Home, Layers, Settings, Trophy } from "lucide-react";
import { AuthControls } from "@/components/auth/auth-controls";
import { countDue } from "@/lib/srs";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

/**
 * Persistent navigation for wide screens (lg and up).
 *
 * Below lg this is hidden and QuickActions carries the same destinations as a
 * 3-up row, because a phone has no room for a rail.
 */
export function NavRail() {
  const user = useUserStore((s) => s.user);
  const weakCount = user.weakWordIds.length;
  const dueCount = countDue(user.srsCards);

  const items = [
    { href: "/home", label: "Home", icon: Home, badge: null as string | null, badgeTint: "" },
    {
      href: "/flashcards",
      label: "Cards",
      icon: Layers,
      badge: dueCount > 0 ? String(dueCount) : null,
      badgeTint: "bg-sky-100 text-sky-700",
    },
    {
      href: "/review",
      label: "Review",
      icon: BookMarked,
      badge: weakCount > 0 ? String(weakCount) : null,
      badgeTint: "bg-rose-100 text-rose-700",
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      badge: null,
      badgeTint: "bg-violet-100 text-violet-700",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      badge: null,
      badgeTint: "",
    },
  ];

  return (
    <nav
      aria-label="Main"
      className="sticky top-6 hidden flex-col gap-1 lg:flex lg:col-start-1 lg:row-start-1 lg:row-span-5"
    >
      <Link
        href="/settings"
        aria-label="Settings"
        className="mb-3 flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-slate-100"
      >
        <Image
          src="/images/broto-mascot.png"
          alt=""
          width={40}
          height={46}
          className="h-[46px] w-auto shrink-0 object-contain"
        />
        <span className="min-w-0">
          <span className="block truncate font-greeting text-lg font-bold leading-tight text-slate-900">
            Hola, {user.name || "Learner"}
          </span>
          <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Settings className="h-3 w-3" />
            Settings
          </span>
        </span>
      </Link>

      {items.map(({ href, label, icon: Icon, badge, badgeTint }) => (
        <Link
          key={href}
          href={href}
          aria-current={href === "/home" ? "page" : undefined}
          className={cn(
            "flex min-h-11 items-center gap-3 rounded-2xl border-2 px-3 text-sm font-semibold transition-colors",
            href === "/home"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-transparent text-slate-600 hover:bg-white hover:text-slate-900"
          )}
        >
          <Icon
            className={cn(
              "h-[18px] w-[18px] shrink-0",
              href === "/home" && "text-emerald-600"
            )}
            strokeWidth={2.2}
          />
          {label}
          {badge && (
            <span
              className={cn(
                "ml-auto grid h-5 min-w-[1.375rem] place-items-center rounded-full px-1.5 text-[11px] font-extrabold tabular-nums",
                badgeTint
              )}
            >
              {badge}
            </span>
          )}
        </Link>
      ))}

      <div className="mt-4 border-t-2 border-slate-100 pt-3">
        <AuthControls />
      </div>
    </nav>
  );
}
