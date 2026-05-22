import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const lastModified = new Date('2024-05-22T16:42:00.403Z');

const routes = [
  {
    url: 'https://veraneuro.site/',
    priority: 1,
  },
  {
    url: 'https://veraneuro.site/docs/',
    priority: 0.7,
  },
  {
    url: 'https://veraneuro.site/reviews/',
    priority: 0.7,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: route.url,
    lastModified,
    changeFrequency: 'monthly',
    priority: route.priority,
  }));
}
