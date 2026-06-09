import { NextResponse } from "next/server";

const COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "authjs.csrf-token",
  "__Host-authjs.csrf-token",
  "__Secure-authjs.csrf-token",
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
  "authjs.pkce.code_verifier",
  "__Secure-authjs.pkce.code_verifier",
  "authjs.state",
  "__Secure-authjs.state",
  "authjs.nonce",
  "__Secure-authjs.nonce",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

/**
 * GET /api/auth/clear → wipes any auth cookies and redirects to /login.
 * Useful when a stale cookie (e.g. signed with an old AUTH_SECRET) is making
 * the session endpoint 500. Anyone can hit this safely — it just logs you out.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/login", url.origin));
  for (const name of COOKIE_NAMES) {
    res.cookies.set({
      name,
      value: "",
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: true,
    });
  }
  return res;
}
