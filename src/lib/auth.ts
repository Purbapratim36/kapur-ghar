import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// In production (https) cookies must be Secure-prefixed; locally they are not.
const useSecureCookies = process.env.NODE_ENV === "production";
const cookiePrefix = useSecureCookies ? "__Secure-" : "";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: { email: (credentials.email as string).toLowerCase().trim() },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      } catch (err) {
        console.error("[AUTH ERROR] credentials authorize:", err);
        return null;
      }
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Single secret source — Auth.js v5 only needs AUTH_SECRET.
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers,

  // Explicit cookie configuration. This is the fix for the Vercel
  // "pkceCodeVerifier value could not be parsed" error: the transient OAuth
  // cookies (PKCE verifier, state, nonce) must be Secure + SameSite=Lax so they
  // survive the round-trip to Google and back.
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      // Note: CSRF cookie is intentionally NOT Secure-prefixed with __Host- here
      // to avoid path issues on Vercel; __Secure- prefix is enough.
      name: `${cookiePrefix}authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}authjs.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 900, // 15 minutes — only needed during the OAuth round-trip
      },
    },
    state: {
      name: `${cookiePrefix}authjs.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 900,
      },
    },
    nonce: {
      name: `${cookiePrefix}authjs.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },

  callbacks: {
    // Manually upsert Google users (no Prisma adapter). Links to an existing
    // row if the email already exists, otherwise creates a new USER.
    async signIn({ user, account }) {
      try {
        if (account?.provider !== "google") return true;
        if (!user.email) return false;

        const email = user.email.toLowerCase();
        await db.user.upsert({
          where: { email },
          update: {
            name: user.name || undefined,
            image: user.image || undefined,
          },
          create: {
            email,
            name: user.name || null,
            image: user.image || null,
            role: "USER",
            emailVerified: new Date(),
          },
        });
        return true;
      } catch (err) {
        console.error("[AUTH ERROR] signIn callback:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      try {
        if (user) {
          const u = user as typeof user & { id?: string; role?: string };
          if (u.id) token.id = u.id;
          if (u.role) token.role = u.role;
        }
        if (token.email && (!token.id || !token.role)) {
          const dbUser = await db.user.findUnique({
            where: { email: (token.email as string).toLowerCase() },
            select: { id: true, role: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        }
        return token;
      } catch (err) {
        console.error("[AUTH ERROR] jwt callback:", err);
        return token;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as string) || "USER";
      }
      return session;
    },
  },
});

export const isGoogleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);
