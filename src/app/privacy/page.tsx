import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Uno",
  description:
    "How Uno handles account data, learning progress, and sign-in for our Latin American Spanish learning app.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
        Uno
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated: September 8, 2026. This is a short, plain-English policy
        for an early MVP. It describes what we actually do today — not legal
        theater.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-bold text-slate-900">What Uno is</h2>
          <p className="mt-2">
            Uno is a Latin American Spanish learning app. You can practice in
            demo mode without an account. Signing in is optional and mainly for
            syncing progress across devices.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">
            What data we collect
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Google account basics</strong> if you sign in with Google
              (OAuth): name, email, and profile image Google shares with us.
            </li>
            <li>
              <strong>Learning progress</strong> when you are signed in: XP,
              streak, daily goal, completed lessons, weak words, placement
              choices, and similar progress fields stored in our database.
            </li>
            <li>
              <strong>Session cookies</strong> used by Auth.js / NextAuth so you
              stay signed in securely.
            </li>
          </ul>
          <p className="mt-2">
            In demo mode (no sign-in), progress usually stays on your device
            (browser storage) and is not synced to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">Why we use it</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>To sign you in and keep you signed in.</li>
            <li>To sync and restore your learning progress.</li>
            <li>To show your name / display name in the app.</li>
          </ul>
          <p className="mt-2">
            We do not sell your personal data. We do not use it for advertising
            networks.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">
            Cookies and sessions
          </h2>
          <p className="mt-2">
            Sign-in uses Auth.js (NextAuth) session cookies. Those cookies are
            for authentication only — not third-party ad tracking.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">Where it runs</h2>
          <p className="mt-2">
            Uno is self-hosted on our own infrastructure (including an Unraid
            home-lab style setup). Account and progress data live in our
            Postgres database for the signed-in experience.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">
            Sharing and third parties
          </h2>
          <p className="mt-2">
            Google is involved only for OAuth sign-in (you authenticate with
            Google; we receive the profile fields above). We do not sell or rent
            your data. We may access the database ourselves to fix bugs or
            operate the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">Your choices</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Use demo mode without creating an account.</li>
            <li>Sign out at any time from the app.</li>
            <li>
              Email us to request deletion of your account / progress data (see
              contact below). We will handle requests manually while this is an
              MVP.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">Contact</h2>
          <p className="mt-2">
            Questions or deletion requests:{" "}
            <a
              href="mailto:jparis112@gmail.com"
              className="font-semibold text-emerald-700 underline-offset-2 hover:underline"
            >
              jparis112@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">Changes</h2>
          <p className="mt-2">
            If we change how we handle data in a meaningful way, we will update
            this page and the “Last updated” date.
          </p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-sm font-semibold">
        <Link
          href="/home"
          className="text-emerald-700 hover:text-emerald-800"
        >
          ← Back to home
        </Link>
        <Link href="/login" className="text-slate-500 hover:text-emerald-700">
          Sign in
        </Link>
      </div>
    </div>
  );
}
