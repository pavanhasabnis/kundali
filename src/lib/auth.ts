import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account) return false;

      // For credentials provider, user already exists (verified in authorize)
      if (account.provider === "credentials") {
        await db.update(users).set({ updatedAt: new Date().toISOString() }).where(eq(users.email, user.email));
        return true;
      }

      // Upsert user for OAuth providers (Google)
      const existing = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });

      if (existing) {
        await db.update(users).set({
          name: user.name || existing.name,
          image: user.image || existing.image,
          updatedAt: new Date().toISOString(),
        }).where(eq(users.id, existing.id));
      } else {
        const id = crypto.randomUUID();
        await db.insert(users).values({
          id,
          name: user.name || "User",
          email: user.email,
          image: user.image,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // Attach our DB user data to session
      if (session.user?.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, session.user.email),
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const u = session.user as any;
          u.role = dbUser.role;
          u.plan = dbUser.plan;
          u.language = dbUser.language;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
