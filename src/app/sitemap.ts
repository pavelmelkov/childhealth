import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

const routes = [
  {
    path: '/',
    priority: 1,
  },
  {
    path: '/docs/',
    priority: 0.7,
  },
  {
    path: '/reviews/',
    priority: 0.7,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified,
    changeFrequency: 'monthly',
    priority: route.priority,
  }));
}
