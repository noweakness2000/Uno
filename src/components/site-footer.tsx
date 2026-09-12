import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-slate-400", className)}>
      <Link href="/privacy" className="hover:text-emerald-700 hover:underline">
        Privacy Policy
      </Link>
    </p>
  );
}
