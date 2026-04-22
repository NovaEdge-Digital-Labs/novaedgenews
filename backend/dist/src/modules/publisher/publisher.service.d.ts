import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
export declare class PublisherService {
    private articleModel;
    private readonly logger;
    constructor(articleModel: Model<ArticleDocument>);
    publish(data: any): Promise<(import("mongoose").Document<unknown, {}, ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getTopUndistributedArticles(limit?: number): Promise<(import("mongoose").Document<unknown, {}, ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markAsDistributed(id: string): Promise<(import("mongoose").Document<unknown, {}, ArticleDocument, {}, import("mongoose").DefaultSchemaOptions> & Article & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
