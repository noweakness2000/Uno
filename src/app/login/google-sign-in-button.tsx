"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        className="w-full"
        size="lg"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError(null);
          try {
            await signIn("google", { callbackUrl: "/home" });
          } catch {
            setError("Could not start Google sign-in. Try again.");
            setPending(false);
          }
        }}
      >
        {pending ? "Redirecting…" : "Sign in with Google"}
      </Button>
      {error && (
        <p className="text-center text-xs font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}
