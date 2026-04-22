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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("../../schemas/article.schema");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    articleModel;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async updateTrendingScores() {
        const articles = await this.articleModel.find({ status: 'published' }).exec();
        const now = new Date();
        for (const article of articles) {
            const hours = Math.abs(now.getTime() - article.publishedAt.getTime()) / 36e5;
            let freshness = (24 - hours) / 24;
            if (freshness < 0)
                freshness = 0;
            if (freshness > 1)
                freshness = 1;
            const score = (article.views * 0.7) + (freshness * 0.3);
            await this.articleModel.updateOne({ _id: article._id }, { $set: { trendingScore: score, performanceScore: score } });
        }
    }
    async getDailyTrendingList() {
        const articles = await this.articleModel
            .find({ status: 'published' })
            .sort({ trendingScore: -1 })
            .limit(10)
            .exec();
        const trending = articles.map((a, i) => ({
            rank: i + 1,
            articleId: a._id.toString(),
            title: a.title,
            score: parseFloat(a.trendingScore.toFixed(3)),
            views: a.views,
            clicks: a.clicks,
            ctr: a.views > 0 ? parseFloat((a.clicks / a.views).toFixed(4)) : 0,
            category: a.category
        }));
        const totalViews = trending.reduce((sum, a) => sum + a.views, 0);
        const totalClicks = trending.reduce((sum, a) => sum + a.clicks, 0);
        const categories = trending.map(a => a.category);
        const topCategory = categories.sort((a, b) => categories.filter(v => v === a).length - categories.filter(v => v === b).length).pop();
        return {
            generatedAt: new Date().toISOString(),
            period: '24h',
            trending,
            topCategory: topCategory || 'General',
            totalViews,
            totalClicks
        };
    }
    async getDashboardMetrics() {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const articlesThisMonth = await this.articleModel.find({
            status: 'published',
            publishedAt: { $gte: firstDayOfMonth }
        }).exec();
        const totalViews = articlesThisMonth.reduce((sum, a) => sum + a.views, 0);
        const totalClicks = articlesThisMonth.reduce((sum, a) => sum + (a.clicks || 0), 0);
        const avgCTR = articlesThisMonth.length > 0
            ? totalClicks / totalViews || 0
            : 0;
        const catStats = articlesThisMonth.reduce((acc, a) => {
            acc[a.category] = (acc[a.category] || 0) + a.views;
            return acc;
        }, {});
        const topCategory = Object.keys(catStats).sort((a, b) => catStats[b] - catStats[a])[0];
        const top5 = [...articlesThisMonth]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5)
            .map(a => ({
            title: a.title,
            views: a.views,
            category: a.category
        }));
        return {
            month: now.toLocaleString('default', { month: 'long' }),
            totalArticles: articlesThisMonth.length,
            totalViews,
            avgCTR: parseFloat((avgCTR * 100).toFixed(2)) + '%',
            topCategory: topCategory || 'None',
            topArticles: top5
        };
    }
    async trackShare(identifier, platform) {
        const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier };
        return this.articleModel.findOneAndUpdate(query, { $inc: { shareCount: 1 } }, { new: true }).exec();
    }
    async findArticle(identifier) {
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const query = isObjectId ? { _id: identifier } : { slug: identifier };
        return this.articleModel.findOne(query).exec();
    }
    async trackView(identifier) {
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const query = isObjectId ? { _id: identifier } : { slug: identifier };
        return this.articleModel.findOneAndUpdate(query, { $inc: { views: 1 } }, { new: true }).exec();
    }
    async trackImpression(identifier, variant) {
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const query = isObjectId ? { _id: identifier } : { slug: identifier };
        const update = { $inc: { impressions: 1 } };
        if (variant === 'A')
            update.$inc.impressionsA = 1;
        if (variant === 'B')
            update.$inc.impressionsB = 1;
        return this.articleModel.findOneAndUpdate(query, update, { new: true }).exec();
    }
    async trackClick(identifier, variant) {
        const article = await this.findArticle(identifier);
        if (!article)
            return null;
        const newClicks = article.clicks + 1;
        const totalImpressions = article.impressions > 0 ? article.impressions : 1;
        const ctr = (newClicks / totalImpressions) * 100;
        const update = {
            $set: { clicks: newClicks, ctr },
            $inc: { views: 1 }
        };
        if (variant === 'A')
            update.$inc = { ...update.$inc, clicksA: 1 };
        if (variant === 'B')
            update.$inc = { ...update.$inc, clicksB: 1 };
        return this.articleModel.findOneAndUpdate({ _id: article._id }, update, { new: true }).exec();
    }
    async trackBounce(identifier, variant) {
        const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier };
        const update = variant === 'A' ? { $inc: { bounceCountA: 1 } } : { $inc: { bounceCountB: 1 } };
        return this.articleModel.findOneAndUpdate(query, update).exec();
    }
    async trackTimeOnPage(identifier, variant, durationSeconds) {
        const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier };
        const update = variant === 'A'
            ? { $inc: { totalTimeOnPageA: durationSeconds } }
            : { $inc: { totalTimeOnPageB: durationSeconds } };
        return this.articleModel.findOneAndUpdate(query, update).exec();
    }
    async getABTestResults() {
        const articles = await this.articleModel.find({
            $or: [
                { testingActive: true },
                { preferredVariant: { $ne: null } }
            ]
        }).exec();
        return articles.map(a => {
            const impressionsA = a.impressionsA || 0;
            const impressionsB = a.impressionsB || 0;
            const clicksA = a.clicksA || 0;
            const clicksB = a.clicksB || 0;
            const ctrA = impressionsA > 0 ? (clicksA / impressionsA) * 100 : 0;
            const ctrB = impressionsB > 0 ? (clicksB / impressionsB) * 100 : 0;
            const bounceA = impressionsA > 0 ? (a.bounceCountA || 0) / impressionsA : 0;
            const bounceB = impressionsB > 0 ? (a.bounceCountB || 0) / impressionsB : 0;
            const avgTimeA = impressionsA > 0 ? (a.totalTimeOnPageA || 0) / impressionsA : 0;
            const avgTimeB = impressionsB > 0 ? (a.totalTimeOnPageB || 0) / impressionsB : 0;
            return {
                title: a.title,
                slug: a.slug,
                testingActive: a.testingActive,
                variantA: {
                    impressions: impressionsA,
                    clicks: clicksA,
                    ctr: ctrA.toFixed(2) + '%',
                    bounceRate: (bounceA * 100).toFixed(2) + '%',
                    avgTimeOnPage: avgTimeA.toFixed(1) + 's'
                },
                variantB: {
                    impressions: impressionsB,
                    clicks: clicksB,
                    ctr: ctrB.toFixed(2) + '%',
                    bounceRate: (bounceB * 100).toFixed(2) + '%',
                    avgTimeOnPage: avgTimeB.toFixed(1) + 's'
                },
                winner: a.preferredVariant || 'Pending'
            };
        });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map