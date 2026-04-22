import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';

@Injectable()
export class SEOService {
    constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) { }

    async generateSitemap(baseUrl: string): Promise<string> {
        const articles = await this.articleModel
            .find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(1000)
            .exec();

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
    <changefreq>hourly</changefreq>
  </url>`;

        for (const article of articles) {
            xml += `
  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${article.publishedAt.toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`;
        }

        xml += '\n</urlset>';
        return xml;
    }

    async generateRSS(baseUrl: string): Promise<string> {
        const articles = await this.articleModel
            .find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(50)
            .exec();

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>NovaEdge News</title>
    <link>${baseUrl}</link>
    <description>Production-grade, AI-powered technology news engine.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`;

        for (const article of articles) {
            xml += `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/article/${article.slug}</link>
      <guid>${baseUrl}/article/${article.slug}</guid>
      <pubDate>${article.publishedAt.toUTCString()}</pubDate>
      <description><![CDATA[${article.summary}]]></description>
      <dc:creator>NovaEdge Assistant</dc:creator>
      <category>${article.category}</category>
    </item>`;
        }

        xml += `
  </channel>
</rss>`;
        return xml;
    }

    getJsonLd(article: Article, baseUrl: string) {
        return {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            'headline': article.title,
            'description': article.summary,
            'image': [article.image],
            'datePublished': article.publishedAt.toISOString(),
            'author': [{
                '@type': 'Organization',
                'name': 'NovaEdge News',
                'url': baseUrl,
            }],
            'publisher': {
                '@type': 'Organization',
                'name': 'NovaEdge News',
                'logo': {
                    '@type': 'ImageObject',
                    'url': `${baseUrl}/logo.png`,
                },
            },
        };
    }
}
