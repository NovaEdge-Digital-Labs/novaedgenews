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
var SitemapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("../../schemas/article.schema");
const config_1 = require("@nestjs/config");
let SitemapService = SitemapService_1 = class SitemapService {
    articleModel;
    configService;
    logger = new common_1.Logger(SitemapService_1.name);
    constructor(articleModel, configService) {
        this.articleModel = articleModel;
        this.configService = configService;
    }
    async generateSitemapXml() {
        this.logger.log('Generating sitemap XML...');
        const frontendUrl = this.configService.get('frontend.url') || 'http://localhost:3000';
        const articles = await this.articleModel
            .find({ status: 'published', isLive: true })
            .select('slug updatedAt category')
            .sort({ updatedAt: -1 })
            .exec();
        const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        xml += `  <url>\n    <loc>${frontendUrl}/</loc>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        for (const cat of categories) {
            xml += `  <url>\n    <loc>${frontendUrl}/category/${cat}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        }
        for (const article of articles) {
            const updatedAt = article.updatedAt || new Date();
            xml += `  <url>\n    <loc>${frontendUrl}/articles/${article.slug}</loc>\n    <lastmod>${updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        }
        xml += `</urlset>`;
        return xml;
    }
    async generateRobotsTxt() {
        const frontendUrl = this.configService.get('frontend.url') || 'http://localhost:3000';
        return `User-agent: *\nAllow: /\n\nSitemap: ${frontendUrl}/sitemap.xml`;
    }
};
exports.SitemapService = SitemapService;
exports.SitemapService = SitemapService = SitemapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], SitemapService);
//# sourceMappingURL=sitemap.service.js.map