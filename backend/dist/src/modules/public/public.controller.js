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
exports.PublicController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("../../schemas/article.schema");
const analytics_service_1 = require("../analytics/analytics.service");
const seo_service_1 = require("./seo.service");
let PublicController = class PublicController {
    articleModel;
    analyticsService;
    seoService;
    BASE_URL = process.env.BASE_URL || 'https://novaedge.news';
    constructor(articleModel, analyticsService, seoService) {
        this.articleModel = articleModel;
        this.analyticsService = analyticsService;
        this.seoService = seoService;
    }
    async getSitemap() {
        return this.seoService.generateSitemap(this.BASE_URL);
    }
    async getRSS() {
        return this.seoService.generateRSS(this.BASE_URL);
    }
    async getArticles(page = 1, limit = 10, category) {
        const query = { status: 'published' };
        if (category)
            query['category'] = category;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.articleModel
                .find(query)
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.articleModel.countDocuments(query),
        ]);
        const processedData = data.map(article => {
            let displayTitle = article.title;
            let variant = 'A';
            if (article.testingActive && article.headlineA && article.headlineB) {
                const charCode = article._id.toString().charCodeAt(article._id.toString().length - 1);
                variant = charCode % 2 === 0 ? 'A' : 'B';
                displayTitle = variant === 'B' ? article.headlineB.text : article.headlineA.text;
                this.analyticsService.trackImpression(article._id.toString(), variant).catch(() => { });
            }
            else if (article.preferredVariant) {
                variant = article.preferredVariant;
                displayTitle = variant === 'B' ? (article.headlineB?.text || article.alternativeTitle) : (article.headlineA?.text || article.title);
            }
            else if (article.alternativeTitle) {
                const charCode = article._id.toString().charCodeAt(article._id.toString().length - 1);
                variant = charCode % 2 === 0 ? 'A' : 'B';
                displayTitle = variant === 'B' ? article.alternativeTitle : article.title;
                this.analyticsService.trackImpression(article._id.toString(), variant).catch(() => { });
            }
            return {
                ...article.toObject(),
                displayTitle,
                variant
            };
        });
        return {
            data: processedData,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getArticleBySlug(slug) {
        const article = await this.articleModel.findOne({ slug }).exec();
        if (!article)
            return null;
        let displayTitle = article.title;
        let variant = 'A';
        if (article.testingActive && article.headlineA && article.headlineB) {
            const charCode = article._id.toString().charCodeAt(article._id.toString().length - 1);
            variant = charCode % 2 === 0 ? 'A' : 'B';
            displayTitle = variant === 'B' ? article.headlineB.text : article.headlineA.text;
        }
        else if (article.preferredVariant) {
            variant = article.preferredVariant;
            displayTitle = variant === 'B' ? (article.headlineB?.text || article.alternativeTitle) : (article.headlineA?.text || article.title);
        }
        await this.analyticsService.trackView(slug);
        return {
            ...article.toObject(),
            displayTitle,
            variant,
            jsonLd: this.seoService.getJsonLd(article, this.BASE_URL),
        };
    }
    async getByCategory(name) {
        return this.articleModel
            .find({ category: name, status: 'published' })
            .sort({ publishedAt: -1 })
            .exec();
    }
    async getTrending(limit = 5) {
        const articles = await this.articleModel
            .find({ status: 'published' })
            .sort({ trendingScore: -1 })
            .limit(limit)
            .exec();
        return articles.map(article => {
            const variant = Math.random() > 0.5 && article.alternativeTitle ? 'B' : 'A';
            return {
                ...article.toObject(),
                displayTitle: variant === 'B' ? article.alternativeTitle : article.title,
                variant
            };
        });
    }
    async getTrendingList() {
        return this.analyticsService.getDailyTrendingList();
    }
    async getDashboard() {
        return this.analyticsService.getDashboardMetrics();
    }
    async getABTestResults() {
        return this.analyticsService.getABTestResults();
    }
    async getEditorPicks(limit = 3) {
        return this.articleModel
            .find({ status: 'published', isEditorPick: true })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .exec();
    }
    async getMostRead(limit = 5) {
        return this.articleModel
            .find({ status: 'published' })
            .sort({ views: -1 })
            .limit(limit)
            .exec();
    }
};
exports.PublicController = PublicController;
__decorate([
    (0, common_1.Get)('sitemap.xml'),
    (0, common_1.Header)('Content-Type', 'application/xml'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getSitemap", null);
__decorate([
    (0, common_1.Get)('rss.xml'),
    (0, common_1.Header)('Content-Type', 'application/rss+xml'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getRSS", null);
__decorate([
    (0, common_1.Get)('articles'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getArticles", null);
__decorate([
    (0, common_1.Get)('articles/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getArticleBySlug", null);
__decorate([
    (0, common_1.Get)('category/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getByCategory", null);
__decorate([
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getTrending", null);
__decorate([
    (0, common_1.Get)('analytics/trending-list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getTrendingList", null);
__decorate([
    (0, common_1.Get)('analytics/dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('analytics/ab-tests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getABTestResults", null);
__decorate([
    (0, common_1.Get)('editor-picks'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getEditorPicks", null);
__decorate([
    (0, common_1.Get)('most-read'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getMostRead", null);
exports.PublicController = PublicController = __decorate([
    (0, common_1.Controller)('api'),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        analytics_service_1.AnalyticsService,
        seo_service_1.SEOService])
], PublicController);
//# sourceMappingURL=public.controller.js.map