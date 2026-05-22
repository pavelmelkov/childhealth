export const dynamic = 'force-static';

const lastModified = new Date().toISOString();

const routes = [
  {
    url: 'https://veraneuro.site/',
    priority: '1',
  },
  {
    url: 'https://veraneuro.site/docs/',
    priority: '0.7',
  },
  {
    url: 'https://veraneuro.site/reviews/',
    priority: '0.7',
  },
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

export function GET() {
  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
