import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

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
        console.error("[auth] credentials authorize failed:", err);
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
  // NOTE: no Prisma adapter. With JWT session strategy + the production pattern
  // of handling OAuth users manually in callbacks, the adapter just gets in the
  // way — it tries to create users via its own schema assumptions and fails when
  // an email already exists. We do user upserts ourselves in `signIn` below.
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers,
  callbacks: {
    // Upsert the Google user record into our DB. If a user with the same email
    // already exists (e.g. you registered with password first, now signing in
    // with Google), we link to that existing row instead of failing.
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;

      try {
        const email = user.email.toLowerCase();
        await db.user.upsert({
          where: { email },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          },
          create: {
            email,
            name: user.name ?? null,
            image: user.image ?? null,
            role: "USER",
            emailVerified: new Date(),
          },
        });
        return true;
      } catch (err) {
        console.error("[auth] Google signIn upsert failed:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      // First sign-in: copy over id/role from `user`
      if (user) {
        const u = user as typeof user & { id?: string; role?: string };
        if (u.id) token.id = u.id;
        if (u.role) token.role = u.role;
      }

      // If we still don't have id/role (Google first sign-in), look up by email
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
