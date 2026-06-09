import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

const providers: NextAuthConfig["providers"] = [
  // Email + password
  Credentials({
    id: "credentials",
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

  // Google via Firebase. The browser does the Google popup (Firebase), gets an
  // ID token, and posts it here. We verify it server-side with the Firebase
  // Admin SDK, then upsert the user and issue a normal NextAuth session.
  // This sidesteps all the OAuth-redirect/cookie problems on Vercel.
  Credentials({
    id: "firebase",
    name: "firebase",
    credentials: {
      idToken: { label: "Firebase ID Token", type: "text" },
    },
    async authorize(credentials) {
      try {
        const idToken = credentials?.idToken as string | undefined;
        if (!idToken) return null;
        if (!isFirebaseAdminConfigured()) {
          console.error("[AUTH ERROR] firebase provider used but Admin not configured");
          return null;
        }

        const decoded = await getAdminAuth().verifyIdToken(idToken);
        if (!decoded.email) return null;

        const email = decoded.email.toLowerCase();
        const user = await db.user.upsert({
          where: { email },
          update: {
            name: decoded.name || undefined,
            image: decoded.picture || undefined,
          },
          create: {
            email,
            name: decoded.name || null,
            image: decoded.picture || null,
            role: "USER",
            emailVerified: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      } catch (err) {
        console.error("[AUTH ERROR] firebase authorize:", err);
        return null;
      }
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers,
  callbacks: {
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

// Client flag — Google (via Firebase) available when the public config exists
export const isGoogleEnabled = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
