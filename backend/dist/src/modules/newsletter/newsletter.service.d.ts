import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Subscriber, SubscriberDocument } from '../../schemas/subscriber.schema';
import { Newsletter, NewsletterDocument } from '../../schemas/newsletter.schema';
import { ArticleDocument } from '../../schemas/article.schema';
export declare class NewsletterService {
    private subscriberModel;
    private newsletterModel;
    private articleModel;
    private readonly configService;
    private readonly logger;
    constructor(subscriberModel: Model<SubscriberDocument>, newsletterModel: Model<NewsletterDocument>, articleModel: Model<ArticleDocument>, configService: ConfigService);
    subscribe(email: string, preferences?: any): Promise<import("mongoose").Document<unknown, {}, SubscriberDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscriber & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    unsubscribe(token: string): Promise<import("mongoose").Document<unknown, {}, SubscriberDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscriber & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    sendDailyDigest(): Promise<(import("mongoose").Document<unknown, {}, NewsletterDocument, {}, import("mongoose").DefaultSchemaOptions> & Newsletter & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    trackOpen(newsletterId: string): Promise<(import("mongoose").Document<unknown, {}, NewsletterDocument, {}, import("mongoose").DefaultSchemaOptions> & Newsletter & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    trackClick(newsletterId: string): Promise<(import("mongoose").Document<unknown, {}, NewsletterDocument, {}, import("mongoose").DefaultSchemaOptions> & Newsletter & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    private generateHtml;
}
