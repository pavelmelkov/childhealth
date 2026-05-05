'use client';

import { signOut } from 'next-auth/react';

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className = 'btn btn-outline-light' }: SignOutButtonProps) {
  return (
    <button className={className} type="button" onClick={() => signOut({ callbackUrl: '/' })}>
      Выйти
    </button>
  );
}
