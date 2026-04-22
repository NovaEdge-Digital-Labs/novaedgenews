export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novaedge.tech';
    const robots = `# NovaEdge News Robots Config

User-agent: *
Allow: /
Allow: /articles/
Allow: /trending/
Allow: /api/sitemap/

Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /*.json$
Disallow: /*?*sort=
Disallow: /*?*page=2

Crawl-delay: 1
Request-rate: 1/5s

# Sitemap
Sitemap: ${siteUrl}/api/sitemap
Sitemap: ${siteUrl}/sitemap-index.xml`;

    return new Response(robots, {
        headers: { 'Content-Type': 'text/plain' }
    });
}
