import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';

@Injectable()
export class AnalyticsService {
    private readonly logger = new Logger(AnalyticsService.name);

    constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) { }

    /**
     * Calculates trending score: (views * 0.7) + (freshness * 0.3)
     * Freshness = (24 - hours_since_published) / 24 (max 1.0)
     */
    async updateTrendingScores() {
        const articles = await this.articleModel.find({ status: 'published' }).exec();
        const now = new Date();

        for (const article of articles) {
            const hours = Math.abs(now.getTime() - article.publishedAt.getTime()) / 36e5;
            let freshness = (24 - hours) / 24;
            if (freshness < 0) freshness = 0;
            if (freshness > 1) freshness = 1;

            const score = (article.views * 0.7) + (freshness * 0.3);

            await this.articleModel.updateOne(
                { _id: article._id },
                { $set: { trendingScore: score, performanceScore: score } }
            );
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

        // Find top category in the trending list
        const categories = trending.map(a => a.category);
        const topCategory = categories.sort((a, b) =>
            categories.filter(v => v === a).length - categories.filter(v => v === b).length
        ).pop();

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

        // Categories performance
        const catStats = articlesThisMonth.reduce((acc, a) => {
            acc[a.category] = (acc[a.category] || 0) + a.views;
            return acc;
        }, {});
        const topCategory = Object.keys(catStats).sort((a, b) => catStats[b] - catStats[a])[0];

        // Top 5 articles (all time or this month? I'll do this month based on views)
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

    async trackShare(identifier: string, platform?: string) {
        const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier };
        return this.articleModel.findOneAndUpdate(
            query,
            { $inc: { shareCount: 1 } },
            { new: true }
        ).exec();
    }

    private async findArticle(identifier: string) {
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const query = isObjectId ? { _id: identifier } : { slug: identifier };
        return this.articleModel.findOne(query).exec();
    }

    async trackView(identifier: string) {
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const query = isObjectId ? { _id: identifier } : { slug: identifier };

        return this.articleModel.findOneAndUpdate(
            query,
            { $inc: { views: 1 } },
            { new: true }
        ).exec();
    }

    async trackImpression(identifier: string, variant?: 'A' | 'B') {
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const query = isObjectId ? { _id: identifier } : { slug: identifier };

        const update: any = { $inc: { impressions: 1 } };
        if (variant === 'A') update.$inc.impressionsA = 1;
        if (variant === 'B') update.$inc.impressionsB = 1;

        return this.articleModel.findOneAndUpdate(query, update, { new: true }).exec();
    }

    async trackClick(identifier: string, variant?: 'A' | 'B') {
        const article = await this.findArticle(identifier);
        if (!article) return null;

        const newClicks = article.clicks + 1;
        const totalImpressions = article.impressions > 0 ? article.impressions : 1;
        const ctr = (newClicks / totalImpressions) * 100;

        const update: any = {
            $set: { clicks: newClicks, ctr },
            $inc: { views: 1 }
        };

        if (variant === 'A') update.$inc = { ...update.$inc, clicksA: 1 };
        if (variant === 'B') update.$inc = { ...update.$inc, clicksB: 1 };

        return this.articleModel.findOneAndUpdate({ _id: article._id }, update, { new: true }).exec();
    }

    async trackBounce(identifier: string, variant: 'A' | 'B') {
        const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier };
        const update = variant === 'A' ? { $inc: { bounceCountA: 1 } } : { $inc: { bounceCountB: 1 } };
        return this.articleModel.findOneAndUpdate(query, update).exec();
    }

    async trackTimeOnPage(identifier: string, variant: 'A' | 'B', durationSeconds: number) {
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
}
