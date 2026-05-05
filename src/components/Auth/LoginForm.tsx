'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const login = String(formData.get('login') ?? '');
    const password = String(formData.get('password') ?? '');

    const result = await signIn('credentials', {
      login,
      password,
      redirect: false,
      callbackUrl: '/admin',
    });

    setIsLoading(false);

    if (!result || result.error) {
      setError('Проверьте email и пароль.');
      return;
    }

    router.push(result.url ?? '/admin');
    router.refresh();
  }

  return (
    <form className="auth__form card-glass" onSubmit={handleSubmit}>
      <div>
        <label className="auth__label" htmlFor="login">
          Email или телефон
        </label>
        <input
          className="auth__input"
          id="login"
          name="login"
          type="text"
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label className="auth__label" htmlFor="password">
          Пароль
        </label>
        <input
          className="auth__input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {error ? <p className="auth__error">{error}</p> : null}

      <button className="btn btn-primary btn-lg" type="submit" disabled={isLoading}>
        {isLoading ? 'Входим...' : 'Войти'}
      </button>
    </form>
  );
}
