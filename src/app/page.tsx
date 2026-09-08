"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";

export default function RootPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const redirect = () => {
      const done = useUserStore.getState().user.onboardingComplete;
      router.replace(done ? "/home" : "/onboarding");
    };

    if (useUserStore.persist.hasHydrated()) {
      redirect();
      setReady(true);
      return;
    }

    const unsub = useUserStore.persist.onFinishHydration(() => {
      redirect();
      setReady(true);
    });
    return unsub;
  }, [router]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div
        className={`h-10 w-10 rounded-full bg-emerald-400 ${ready ? "" : "animate-pulse"}`}
      />
    </div>
  );
}
