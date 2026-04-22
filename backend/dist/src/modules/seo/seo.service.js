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
var SeoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("../../schemas/article.schema");
const ai_service_1 = require("../ai/ai.service");
const config_1 = require("@nestjs/config");
let SeoService = SeoService_1 = class SeoService {
    articleModel;
    aiService;
    configService;
    logger = new common_1.Logger(SeoService_1.name);
    constructor(articleModel, aiService, configService) {
        this.articleModel = articleModel;
        this.aiService = aiService;
        this.configService = configService;
    }
    async generateSeoMetadata(articleId) {
        const article = await this.articleModel.findById(articleId);
        if (!article) {
            this.logger.error(`Article not found: ${articleId}`);
            return null;
        }
        this.logger.log(`Generating AI SEO metadata for: ${article.title}`);
        try {
            const prompt = `
                Generate professional SEO metadata for this news article.
                Return ONLY a JSON object with this structure:
                {
                  "metaTitle": "SEO title under 60 chars",
                  "metaDescription": "compelling meta description under 160 chars",
                  "metaKeywords": ["keyword1", "keyword2"],
                  "ogTitle": "social sharing title",
                  "ogDescription": "social sharing description"
                }

                Article Details:
                Title: ${article.title}
                Summary: ${article.summary}
                Tags: ${article.tags.join(', ')}
            `;
            const rawResponse = await this.aiService.callAI(this.aiService.primaryClient, prompt, 'gpt-4o');
            let seoData;
            try {
                const cleaned = rawResponse.replace(/```json|```/g, '').trim();
                seoData = JSON.parse(cleaned);
            }
            catch (e) {
                this.logger.error(`Failed to parse AI SEO response: ${rawResponse}`);
                return article;
            }
            const frontendUrl = this.configService.get('frontend.url') || 'https://novaedge.news';
            const articleUrl = `${frontendUrl}/news/${article.slug}`;
            const imageUrl = article.mainImage || article.image;
            article.seo = {
                metaTitle: seoData.metaTitle || article.title.slice(0, 60),
                metaDescription: seoData.metaDescription || article.summary.slice(0, 160),
                metaKeywords: seoData.metaKeywords || article.tags || [],
                canonical: articleUrl,
                og: {
                    title: seoData.ogTitle || seoData.metaTitle,
                    description: seoData.ogDescription || seoData.metaDescription,
                    image: imageUrl,
                    url: articleUrl,
                    type: 'article',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: seoData.ogTitle || seoData.metaTitle,
                    description: seoData.ogDescription || seoData.metaDescription,
                    image: imageUrl,
                },
                schema: {
                    type: 'NewsArticle',
                    publisher: 'NovaEdge News',
                }
            };
            article.metaTitle = article.seo.metaTitle;
            article.metaDescription = article.seo.metaDescription;
            article.metaKeywords = article.seo.metaKeywords;
            return await article.save();
        }
        catch (error) {
            this.logger.error(`SEO generation failed: ${error.message}`);
            return article;
        }
    }
    async updateArticleSeo(articleId) {
        return this.generateSeoMetadata(articleId);
    }
    async generateSitemap() {
        const publishedArticles = await this.articleModel
            .find({ status: 'published' })
            .select('slug publishedAt')
            .sort({ publishedAt: -1 })
            .limit(5000)
            .exec();
        const frontendUrl = this.configService.get('frontend.url') || 'https://novaedge.news';
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        xml += `  <url>\n    <loc>${frontendUrl}</loc>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        publishedArticles.forEach(article => {
            const lastMod = article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString();
            xml += `  <url>\n    <loc>${frontendUrl}/news/${article.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });
        xml += '</urlset>';
        return xml;
    }
};
exports.SeoService = SeoService;
exports.SeoService = SeoService = SeoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        ai_service_1.AIService,
        config_1.ConfigService])
], SeoService);
//# sourceMappingURL=seo.service.js.map