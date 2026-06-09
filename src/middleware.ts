import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The one canonical production host. OAuth cookies (PKCE/state) are domain-scoped,
// so the sign-in flow MUST start and finish on the same host. Vercel generates a
// unique per-deploy URL (e.g. kapur-ghar-abc123.vercel.app) every push; if a user
// starts Google sign-in there, the callback returns to the canonical host and the
// cookie is lost. This middleware redirects any non-canonical kapur-ghar*.vercel.app
// deployment URL to the canonical host so auth always happens on one domain.
const CANONICAL_HOST = "kapur-ghar.vercel.app";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  const isVercelDeployUrl =
    host.endsWith(".vercel.app") &&
    host !== CANONICAL_HOST &&
    host.includes("kapur-ghar");

  if (isVercelDeployUrl) {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next.js internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp4|webm)$).*)"],
};
