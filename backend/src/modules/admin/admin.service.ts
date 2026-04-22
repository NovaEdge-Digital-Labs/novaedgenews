import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { Subscriber } from '../../schemas/subscriber.schema';
import { Newsletter } from '../../schemas/newsletter.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        @InjectModel(Subscriber.name) private subscriberModel: Model<any>,
        @InjectModel(Newsletter.name) private newsletterModel: Model<any>,
    ) { }

    async getDashboardStats() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOf30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // KPI
        const totalArticles = await this.articleModel.countDocuments({
            status: 'published',
            publishedAt: { $gte: startOfMonth }
        });

        const viewStats = await this.articleModel.aggregate([
            { $match: { status: 'published' } },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' },
                    totalClicks: { $sum: '$clicks' }
                }
            }
        ]);

        const totalViews = viewStats[0]?.totalViews || 0;
        const totalClicks = viewStats[0]?.totalClicks || 0;
        const avgCtr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

        const catStats = await this.articleModel.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$category', views: { $sum: '$views' } } },
            { $sort: { views: -1 } },
            { $limit: 1 }
        ]);

        const topCategory = catStats[0]?._id || 'None';
        const revenue = parseFloat(((totalViews / 1000) * 1.5).toFixed(2)); // $1.5 RPM mock

        // Daily Views Chart (Last 30 days pseudo-data based on actual total views smoothed out for demo, or real aggregation if date logic exists)
        // Since we don't track daily views per article in simple scalar 'views' field, we mock a daily trend curve based on totalViews
        const dailyViews = Array.from({ length: 30 }).map((_, i) => {
            const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
            return {
                date: date.toISOString().split('T')[0],
                views: Math.floor(totalViews / 30 * (1 + (Math.random() * 0.4 - 0.2))),
                clicks: Math.floor(totalClicks / 30 * (1 + (Math.random() * 0.4 - 0.2)))
            };
        });

        // Category Breakdown
        const categoryBreakdownData = await this.articleModel.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$category', views: { $sum: '$views' } } }
        ]);

        let totalCatViews = categoryBreakdownData.reduce((acc, curr) => acc + curr.views, 0);
        if (totalCatViews === 0) totalCatViews = 1;

        const categoryBreakdown = categoryBreakdownData.map(c => ({
            category: c._id || 'Uncategorized',
            views: c.views,
            percentage: parseFloat(((c.views / totalCatViews) * 100).toFixed(1))
        }));

        // Top 10 Articles
        const topArticles = await this.articleModel.find({ status: 'published' })
            .sort({ views: -1 })
            .limit(10)
            .select('title views clicks ctr category status')
            .lean();

        const topArticlesMapped = topArticles.map(a => ({
            id: a._id.toString(),
            title: a.title,
            views: a.views || 0,
            clicks: a.clicks || 0,
            ctr: (a.ctr || 0) * 100,
            category: a.category,
            status: a.status
        }));

        // Headline Tests
        const headlineTestsRaw = await this.articleModel.find({
            $or: [
                { testStartDate: { $exists: true, $ne: null } },
                { alternativeTitle: { $exists: true, $ne: null } }
            ]
        }).limit(10).lean();

        const headlineTests = headlineTestsRaw.map(a => ({
            articleId: a._id.toString(),
            title: a.title,
            variantA: { headline: a.title, ctr: (a.clicks / (a.views || 1)) * 100 },
            variantB: { headline: a.alternativeTitle || a.title, ctr: ((a.clicks * 1.1) / (a.views || 1)) * 100 }, // Mock slight difference
            winner: 'B',
            testDays: a.testStartDate ? Math.floor((now.getTime() - new Date(a.testStartDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
        }));

        // Newsletter stats
        let subscribers = 0, openRate = 0, clickRate = 0;
        try {
            subscribers = await this.subscriberModel.countDocuments({ status: 'active' });
            const newsletters = await this.newsletterModel.find({ status: 'sent' }).sort({ sentAt: -1 }).limit(5);
            if (newsletters.length > 0) {
                const totalSent = newsletters.reduce((acc, n) => acc + (n.sentCount || 0), 0);
                const totalOpened = newsletters.reduce((acc, n) => acc + (n.openCount || 0), 0);
                const totalClicked = newsletters.reduce((acc, n) => acc + (n.clickCount || 0), 0);
                openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
                clickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;
            }
        } catch (e) { }

        // Pipeline Stats
        const pipelineStatusAggregation = await this.articleModel.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const pipelineMap = pipelineStatusAggregation.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        const pipeline = {
            pending_discovery: pipelineMap['draft'] || 0,
            pending_extraction: pipelineMap['pending_analysis'] || 0,
            pending_rewrite: pipelineMap['pending_generation'] || 0,
            ready_publish: pipelineMap['scheduled'] || 0,
            published_today: await this.articleModel.countDocuments({ status: 'published', publishedAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) } }),
            failed: pipelineMap['failed'] || pipelineMap['rejected'] || 0
        };

        return {
            kpi: {
                totalArticles,
                totalViews,
                totalClicks,
                avgCtr: parseFloat(avgCtr.toFixed(2)),
                topCategory,
                revenue
            },
            charts: {
                dailyViews,
                categoryBreakdown
            },
            topArticles: topArticlesMapped,
            headlineTests,
            newsletter: {
                subscribers,
                openRate: parseFloat(openRate.toFixed(2)),
                clickRate: parseFloat(clickRate.toFixed(2))
            },
            pipeline
        };
    }

    async getExportReport(period: string) {
        const topArticles = await this.articleModel.find({ status: 'published' })
            .select('title publishedAt category views clicks ctr')
            .sort({ views: -1 })
            .limit(100)
            .lean();

        let csv = 'Title,Published At,Category,Views,Clicks,CTR %\n';

        topArticles.forEach(a => {
            const title = `"${(a.title || '').replace(/"/g, '""')}"`;
            const date = a.publishedAt ? new Date(a.publishedAt).toISOString().split('T')[0] : '';
            const ctr = ((a.ctr || 0) * 100).toFixed(2);
            csv += `${title},${date},${a.category},${a.views || 0},${a.clicks || 0},${ctr}\n`;
        });

        return csv;
    }
}
