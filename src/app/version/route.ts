import { NextResponse } from "next/server";
import { APP_VERSION_LABEL } from "@/lib/app-version";

export function GET() {
  return new NextResponse(APP_VERSION_LABEL, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
