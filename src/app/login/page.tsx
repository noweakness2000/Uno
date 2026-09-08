import Link from "next/link";
import { isGoogleAuthConfigured } from "@/auth";
import { GoogleSignInButton } from "./google-sign-in-button";

export const metadata = {
  title: "Sign in — Uno",
};

export default function LoginPage() {
  const googleReady = isGoogleAuthConfigured();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Uno
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create an account or sign in with Google to sync progress. You can
          keep using demo mode without signing in.
        </p>

        <div className="mt-6 space-y-3">
          {googleReady ? (
            <GoogleSignInButton />
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">Google sign-in is not configured yet</p>
              <p className="mt-1 text-amber-800/90">
                Set <code className="font-mono text-xs">AUTH_GOOGLE_ID</code> and{" "}
                <code className="font-mono text-xs">AUTH_GOOGLE_SECRET</code> on
                the server (see README). Demo learning still works without login.
              </p>
            </div>
          )}
        </div>

        <Link
          href="/home"
          className="mt-6 block text-center text-sm font-semibold text-slate-500 hover:text-emerald-700"
        >
          Continue without signing in
        </Link>
      </div>
    </div>
  );
}
