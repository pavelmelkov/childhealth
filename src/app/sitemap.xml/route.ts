export const dynamic = 'force-static';

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://veraneuro.site/</loc>
    <lastmod>2024-05-22T16:42:00.403Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://veraneuro.site/docs/</loc>
    <lastmod>2024-05-22T16:42:00.403Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://veraneuro.site/reviews/</loc>
    <lastmod>2024-05-22T16:42:00.403Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`;

export function GET() {
  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
