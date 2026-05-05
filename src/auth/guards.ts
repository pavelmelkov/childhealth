import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from './options';

type AuthenticatedSession = Session & {
  user: NonNullable<Session['user']>;
};

export async function requireSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return session as AuthenticatedSession;
}

export async function requireAdmin() {
  const session = await requireSession();

  if (session.user.role !== 'admin') {
    redirect('/cabinet');
  }

  return session;
}
