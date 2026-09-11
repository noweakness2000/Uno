"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface Props {
  /** Where to land after Google returns. Defaults to the home screen. */
  callbackUrl?: string;
  label?: string;
  pendingLabel?: string;
  /**
   * Runs immediately before the redirect — used by onboarding to persist the
   * learner's defaults so returning from Google doesn't bounce them back.
   */
  onBeforeSignIn?: () => void;
  className?: string;
  variant?: "default" | "outline";
}

/**
 * Starts the Auth.js Google flow.
 *
 * Note: sign-in currently fails with MissingCSRF inside the Android WebView.
 * That is a pre-existing issue unrelated to this component; keep using the
 * standard next-auth/react signIn() here so the behaviour is not made worse.
 */
export function GoogleSignInButton({
  callbackUrl = "/home",
  label = "Sign in with Google",
  pendingLabel = "Redirecting…",
  onBeforeSignIn,
  className,
  variant = "default",
}: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={variant}
        className={className ?? "w-full"}
        size="lg"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError(null);
          try {
            onBeforeSignIn?.();
            await signIn("google", { callbackUrl });
          } catch {
            setError("Could not start Google sign-in. Try again.");
            setPending(false);
          }
        }}
      >
        {pending ? pendingLabel : label}
      </Button>
      {error && (
        <p className="text-center text-xs font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}
