import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The single canonical production host. Firebase Auth domain whitelist is
// strictly host-scoped — only the exact hostnames listed in the Firebase
// console can open the Google popup. Vercel generates a new per-deploy URL
// (e.g. kapur-ghar-7fogcuong-...vercel.app) on every push, which is NOT in
// the Firebase whitelist, so any attempt to sign in from there throws
// `auth/unauthorized-domain`. This middleware transparently bounces any
// kapur-ghar-*.vercel.app deploy URL to the canonical host before the page
// renders, so the user never even loads Firebase on the wrong host.
const CANONICAL_HOST = "kapur-ghar.vercel.app";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // Don't touch localhost, custom domains, or the canonical host itself
  if (
    host === CANONICAL_HOST ||
    host.startsWith("localhost") ||
    !host.endsWith(".vercel.app")
  ) {
    return NextResponse.next();
  }

  // Only redirect Vercel-generated deploy URLs for this project
  if (host.includes("kapur-ghar") && host !== CANONICAL_HOST) {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every request except Next.js internals, API routes (we don't want
  // OAuth callbacks redirected mid-flight), and static assets.
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp4|webm|woff2?|ttf)$).*)",
  ],
};
