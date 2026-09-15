"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  clearAuthSessionHint,
  readAuthSessionHint,
  writeAuthSessionHint,
  type AuthSessionHint,
} from "@/lib/auth-session-hint";

export function AuthControls() {
  const { data: session, status } = useSession();
  const [hint, setHint] = useState<AuthSessionHint | null>(null);
  const [reconnectPending, setReconnectPending] = useState(false);

  const userEmail = session?.user?.email;
  const userName = session?.user?.name;

  useEffect(() => {
    setHint(readAuthSessionHint());
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    writeAuthSessionHint({
      email: userEmail,
      name: userName,
    });
    setHint(readAuthSessionHint());
  }, [status, session?.user, userEmail, userName]);

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
        onClick={() => {
          clearAuthSessionHint();
          setHint(null);
          void signOut({ callbackUrl: "/home" });
        }}
        title={session.user.email || session.user.name || "Account"}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    );
  }

  // Soft reconnect: cookie gone but we remember a recent sign-in on this device.
  if (hint) {
    const who = hint.name || hint.email || "your account";
    return (
      <Button
        type="button"
        variant="soft"
        size="sm"
        disabled={reconnectPending}
        title={`Session expired for ${who}. Sign in again with Google.`}
        onClick={async () => {
          setReconnectPending(true);
          try {
            await signIn("google", { callbackUrl: "/home" });
          } catch {
            setReconnectPending(false);
          }
        }}
      >
        <RefreshCw className="h-4 w-4" />
        {reconnectPending ? "Redirecting…" : "Session expired — Sign in again"}
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
