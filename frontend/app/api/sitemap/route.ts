import { connectDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const db = await connectDB();

        // Get all published articles
        const articles = await db.collection('articles')
            .find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(50000)
            .toArray();

        // Base URLs
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novaedge.tech';

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Homepage
        xml += `<url>
      <loc>${baseUrl}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>\n`;

        // Trending page
        xml += `<url>
      <loc>${baseUrl}/trending</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>0.9</priority>
    </url>\n`;

        // Category pages
        const categories = ['tech', 'ai', 'startup', 'business'];
        categories.forEach((cat: string) => {
            xml += `<url>
        <loc>${baseUrl}/articles/category/${cat}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>\n`;
        });

        // Article pages
        articles.forEach((article: any) => {
            const priority = article.views > 1000 ? 0.8 : (article.views > 500 ? 0.6 : 0.4);
            const url = `${baseUrl}/articles/${article.slug}`;
            const updatedDate = article.updatedAt ? new Date(article.updatedAt) : new Date();

            xml += `<url>
        <loc>${url}</loc>
        <lastmod>${updatedDate.toISOString()}</lastmod>
        <changefreq>never</changefreq>
        <priority>${priority.toFixed(1)}</priority>
      </url>\n`;
        });

        xml += '</urlset>';

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            }
        });
    } catch (error) {
        console.error('Sitemap generation failed:', error);
        return new NextResponse('Error generating sitemap', { status: 500 });
    }
}
