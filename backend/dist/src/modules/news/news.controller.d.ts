import { AIService } from '../ai/ai.service';
import { PublisherService } from '../publisher/publisher.service';
export declare class NewsController {
    private readonly aiService;
    private readonly publisherService;
    private readonly logger;
    constructor(aiService: AIService, publisherService: PublisherService);
    analyze(body: {
        title: string;
        content: string;
    }): Promise<{
        message: string;
        article: (import("mongoose").Document<unknown, {}, import("../../schemas/article.schema").ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../schemas/article.schema").Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        message?: undefined;
        article?: undefined;
    }>;
}
