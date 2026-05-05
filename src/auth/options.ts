import { compare } from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';

import { db } from '@/db';
import { users } from '@/db/schema';

const credentialsSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and password',
      credentials: {
        login: { label: 'Email or phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(rawCredentials) {
        const parsedCredentials = credentialsSchema.safeParse(rawCredentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { login, password } = parsedCredentials.data;
        const normalizedLogin = login.toLowerCase();

        const user = await db.query.users.findFirst({
          where: or(eq(users.email, normalizedLogin), eq(users.phone, login)),
        });

        if (!user) {
          return null;
        }

        const passwordIsValid = await compare(password, user.passwordHash);

        if (!passwordIsValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};
