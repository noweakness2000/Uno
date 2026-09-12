import Link from "next/link";
import { APP_VERSION_LABEL } from "@/lib/app-version";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-slate-400", className)}>
      <Link href="/privacy" className="hover:text-emerald-700 hover:underline">
        Privacy Policy
      </Link>
      <span className="mx-1.5 text-slate-300" aria-hidden>
        ·
      </span>
      <span className="tabular-nums text-slate-300">{APP_VERSION_LABEL}</span>
    </p>
  );
}
