import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { XataAdapter } from "@auth/xata-adapter"
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";
import { XataClient } from "~/xata";

type UserRole = 'buyer' | 'artist'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole
    id: string
  }
}

const client = new XataClient()

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signOut: '/',
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token }) {
      if (token.email) {
        if (!token.role) {
          const userFromDb = await client.db.nextauth_users.filter({ email: token.email }).getFirst()
          if (userFromDb) {
            token.role = userFromDb.role as UserRole
            token.id = userFromDb.id
          }
        }
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as UserRole
      session.user.id = token.id as string
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  // @ts-expect-error is isnt needed
  adapter: XataAdapter(client),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // CredentialsProvider({
    //   name: "Sign In",
    //   credentials: {
    //     email: { label: "Email", type: "text", placeholder: "praseem" },
    //     password: { label: "Password", type: "password" }
    //   },
    //   async authorize(credentials) {
    //     if (!credentials) return null
    //     const user = await db.query.users.findFirst({
    //       where: ({ email, password }, { eq, and }) => and(eq(email, credentials.email), eq(password, credentials.password)),
    //     })
    //
    // return user ?? null
    //   }
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
