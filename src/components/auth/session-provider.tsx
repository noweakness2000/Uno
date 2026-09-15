"use client";

import { SessionProvider } from "next-auth/react";

/** Avoid aggressive refetch on iOS Home Screen resume (false signed-out flashes). */
const REFETCH_INTERVAL_SEC = 60 * 60 * 4; // 4 hours

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      refetchOnWindowFocus={false}
      refetchInterval={REFETCH_INTERVAL_SEC}
    >
      {children}
    </SessionProvider>
  );
}
