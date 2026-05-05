import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      role: 'admin' | 'parent';
    } & DefaultSession['user'];
  }

  interface User {
    role: 'admin' | 'parent';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'parent';
  }
}
