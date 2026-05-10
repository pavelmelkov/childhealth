import { CABINET_ENABLED } from '@/lib/features';

type RouteContext = {
  params: Promise<{
    nextauth: string[];
  }>;
};

async function handleAuth(request: Request, context: RouteContext) {
  if (!CABINET_ENABLED) {
    return new Response('Not found', { status: 404 });
  }

  const [{ default: NextAuth }, { authOptions }] = await Promise.all([
    import('next-auth'),
    import('@/auth/options'),
  ]);
  const handler = NextAuth(authOptions);

  return handler(request, context);
}

export { handleAuth as GET, handleAuth as POST };
