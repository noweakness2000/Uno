"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthControls() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="text-xs text-slate-400" aria-hidden>
        …
      </span>
    );
  }

  if (session?.user) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/home" })}
        title={session.user.email || session.user.name || "Account"}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    );
  }

  return (
    <Link href="/login">
      <Button type="button" variant="soft" size="sm">
        <LogIn className="h-4 w-4" />
        Sign in
      </Button>
    </Link>
  );
}
