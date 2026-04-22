import { Controller, Get, Param, Query, Header, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { AnalyticsService } from '../analytics/analytics.service';
import { SEOService } from './seo.service';
import { Response } from 'express';

@Controller('api')
export class PublicController {
    private readonly BASE_URL = process.env.BASE_URL || 'https://novaedge.news';

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        private readonly analyticsService: AnalyticsService,
        private readonly seoService: SEOService,
    ) { }

    @Get('sitemap.xml')
    @Header('Content-Type', 'application/xml')
    async getSitemap() {
        return this.seoService.generateSitemap(this.BASE_URL);
    }

    @Get('rss.xml')
    @Header('Content-Type', 'application/rss+xml')
    async getRSS() {
        return this.seoService.generateRSS(this.BASE_URL);
    }

    @Get('articles')
    async getArticles(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('category') category?: string
    ) {
        const query = { status: 'published' };
        if (category) query['category'] = category;

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

        // A/B Selection logic for titles in the list
        const processedData = data.map(article => {
            let displayTitle = article.title;
            let variant = 'A';

            if (article.testingActive && article.headlineA && article.headlineB) {
                // Deterministic 50/50 split based on ID
                const charCode = article._id.toString().charCodeAt(article._id.toString().length - 1);
                variant = charCode % 2 === 0 ? 'A' : 'B';
                displayTitle = variant === 'B' ? article.headlineB.text : article.headlineA.text;
                // Async track impression
                this.analyticsService.trackImpression(article._id.toString(), variant as any).catch(() => { });
            } else if (article.preferredVariant) {
                variant = article.preferredVariant;
                displayTitle = variant === 'B' ? (article.headlineB?.text || article.alternativeTitle) : (article.headlineA?.text || article.title);
            } else if (article.alternativeTitle) {
                // Legacy
                const charCode = article._id.toString().charCodeAt(article._id.toString().length - 1);
                variant = charCode % 2 === 0 ? 'A' : 'B';
                displayTitle = variant === 'B' ? article.alternativeTitle : article.title;
                this.analyticsService.trackImpression(article._id.toString(), variant as any).catch(() => { });
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

    @Get('articles/:slug')
    async getArticleBySlug(@Param('slug') slug: string) {
        const article = await this.articleModel.findOne({ slug }).exec();
        if (!article) return null;

        // Deterministic variant for consistency
        let displayTitle = article.title;
        let variant = 'A';

        if (article.testingActive && article.headlineA && article.headlineB) {
            const charCode = article._id.toString().charCodeAt(article._id.toString().length - 1);
            variant = charCode % 2 === 0 ? 'A' : 'B';
            displayTitle = variant === 'B' ? article.headlineB.text : article.headlineA.text;
        } else if (article.preferredVariant) {
            variant = article.preferredVariant;
            displayTitle = variant === 'B' ? (article.headlineB?.text || article.alternativeTitle) : (article.headlineA?.text || article.title);
        }

        // Track view and include variant
        await this.analyticsService.trackView(slug);

        return {
            ...article.toObject(),
            displayTitle,
            variant,
            jsonLd: this.seoService.getJsonLd(article as any, this.BASE_URL),
        };
    }

    @Get('category/:name')
    async getByCategory(@Param('name') name: string) {
        return this.articleModel
            .find({ category: name, status: 'published' })
            .sort({ publishedAt: -1 })
            .exec();
    }

    @Get('trending')
    async getTrending(@Query('limit') limit = 5) {
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

    @Get('analytics/trending-list')
    async getTrendingList() {
        return this.analyticsService.getDailyTrendingList();
    }

    @Get('analytics/dashboard')
    async getDashboard() {
        return this.analyticsService.getDashboardMetrics();
    }

    @Get('analytics/ab-tests')
    async getABTestResults() {
        return this.analyticsService.getABTestResults();
    }

    @Get('editor-picks')
    async getEditorPicks(@Query('limit') limit = 3) {
        return this.articleModel
            .find({ status: 'published', isEditorPick: true })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .exec();
    }

    @Get('most-read')
    async getMostRead(@Query('limit') limit = 5) {
        return this.articleModel
            .find({ status: 'published' })
            .sort({ views: -1 })
            .limit(limit)
            .exec();
    }
}
