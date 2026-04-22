import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
export declare class AnalyticsService {
    private articleModel;
    private readonly logger;
    constructor(articleModel: Model<ArticleDocument>);
    updateTrendingScores(): Promise<void>;
    getDailyTrendingList(): Promise<{
        generatedAt: string;
        period: string;
        trending: {
            rank: number;
            articleId: string;
            title: string;
            score: number;
            views: number;
            clicks: number;
            ctr: number;
            category: string;
        }[];
        topCategory: string;
        totalViews: number;
        totalClicks: number;
    }>;
    getDashboardMetrics(): Promise<{
        month: string;
        totalArticles: number;
        totalViews: number;
        avgCTR: string;
        topCategory: string;
        topArticles: {
            title: string;
            views: number;
            category: string;
        }[];
    }>;
    trackShare(identifier: string, platform?: string): Promise<(import("mongoose").Document<unknown, {}, ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    private findArticle;
    trackView(identifier: string): Promise<(import("mongoose").Document<unknown, {}, ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    trackImpression(identifier: string, variant?: 'A' | 'B'): Promise<(import("mongoose").Document<unknown, {}, ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    trackClick(identifier: string, variant?: 'A' | 'B'): Promise<(import("mongoose").Document<unknown, {}, ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    trackBounce(identifier: string, variant: 'A' | 'B'): Promise<(import("mongoose").Document<unknown, {}, ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    trackTimeOnPage(identifier: string, variant: 'A' | 'B', durationSeconds: number): Promise<(import("mongoose").Document<unknown, {}, ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getABTestResults(): Promise<{
        title: string;
        slug: string;
        testingActive: boolean;
        variantA: {
            impressions: number;
            clicks: number;
            ctr: string;
            bounceRate: string;
            avgTimeOnPage: string;
        };
        variantB: {
            impressions: number;
            clicks: number;
            ctr: string;
            bounceRate: string;
            avgTimeOnPage: string;
        };
        winner: string;
    }[]>;
}
