import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";

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

function clearAuthCookiesResponse(body: BodyInit | null, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  for (const name of COOKIE_NAMES) {
    headers.append(
      "Set-Cookie",
      `${name}=; Path=/; Max-Age=0; SameSite=Lax; Secure`
    );
  }
  return new Response(body, { ...init, headers });
}

function safeHandler(orig: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      return await orig(req);
    } catch (err) {
      console.error("[AUTH HANDLER CRASHED]", err);
      const url = new URL(req.url);
      if (
        url.pathname.endsWith("/session") ||
        url.pathname.endsWith("/auth/session")
      ) {
        return clearAuthCookiesResponse(JSON.stringify(null), { status: 200 });
      }
      return clearAuthCookiesResponse(
        JSON.stringify({ error: "auth_handler_error" }),
        { status: 500 }
      );
    }
  };
}

export const GET = safeHandler(handlers.GET);
export const POST = safeHandler(handlers.POST);
