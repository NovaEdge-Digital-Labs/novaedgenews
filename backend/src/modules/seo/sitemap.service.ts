import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SitemapService {
    private readonly logger = new Logger(SitemapService.name);

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        private readonly configService: ConfigService,
    ) { }

    async generateSitemapXml(): Promise<string> {
        this.logger.log('Generating sitemap XML...');
        const frontendUrl = this.configService.get<string>('frontend.url') || 'http://localhost:3000';

        const articles = await this.articleModel
            .find({ status: 'published', isLive: true })
            .select('slug updatedAt category')
            .sort({ updatedAt: -1 })
            .exec();

        const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Homepage
        xml += `  <url>\n    <loc>${frontendUrl}/</loc>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

        // Category Pages
        for (const cat of categories) {
            xml += `  <url>\n    <loc>${frontendUrl}/category/${cat}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        }

        // Article Pages
        for (const article of articles) {
            const updatedAt = (article as any).updatedAt || new Date();
            xml += `  <url>\n    <loc>${frontendUrl}/articles/${article.slug}</loc>\n    <lastmod>${updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        }

        xml += `</urlset>`;
        return xml;
    }

    async generateRobotsTxt(): Promise<string> {
        const frontendUrl = this.configService.get<string>('frontend.url') || 'http://localhost:3000';
        return `User-agent: *\nAllow: /\n\nSitemap: ${frontendUrl}/sitemap.xml`;
    }
}
