import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/Auth/LoginForm';
import { CABINET_ENABLED } from '@/lib/features';

export const metadata: Metadata = {
  title: 'Вход',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  if (!CABINET_ENABLED) {
    notFound();
  }

  const [{ getServerSession }, { authOptions }] = await Promise.all([
    import('next-auth'),
    import('@/auth/options'),
  ]);
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect(session.user.role === 'admin' ? '/admin' : '/cabinet');
  }

  return (
    <main className="auth">
      <div className="container auth__wrap">
        <div className="auth__copy">
          <p className="auth__eyebrow">Личный кабинет</p>
          <h1 className="auth__title">Вход для родителей и администратора</h1>
          <p className="auth__text">
            После входа родитель увидит свой кабинет, записи и публикации. Администратор
            получит доступ к управлению расписанием и материалами.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
