"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEOService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("../../schemas/article.schema");
let SEOService = class SEOService {
    articleModel;
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async generateSitemap(baseUrl) {
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
    async generateRSS(baseUrl) {
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
    getJsonLd(article, baseUrl) {
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
};
exports.SEOService = SEOService;
exports.SEOService = SEOService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SEOService);
//# sourceMappingURL=seo.service.js.map