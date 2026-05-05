import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request) {
    const role = request.nextauth.token?.role;
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

    if (isAdminRoute && role !== 'admin') {
      return NextResponse.redirect(new URL('/cabinet', request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
    pages: {
      signIn: '/login',
    },
  },
);

export const config = {
  matcher: ['/admin/:path*', '/cabinet/:path*'],
};
