import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    trackImpression(data: {
        articleId: string;
        variant?: 'A' | 'B';
    }): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/article.schema").ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../schemas/article.schema").Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    trackClick(data: {
        articleId: string;
        variant?: 'A' | 'B';
    }): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/article.schema").ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../schemas/article.schema").Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    trackView(data: {
        articleId: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/article.schema").ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../schemas/article.schema").Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
