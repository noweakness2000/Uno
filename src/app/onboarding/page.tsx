import { isGoogleAuthConfigured } from "@/auth";
import { OnboardingFlow } from "./onboarding-flow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Welcome — Uno",
};

export default function OnboardingPage() {
  // Server-side env check, same gate the login screen uses.
  return <OnboardingFlow googleReady={isGoogleAuthConfigured()} />;
}
