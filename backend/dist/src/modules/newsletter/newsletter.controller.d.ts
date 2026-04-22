import type { Response } from 'express';
import { NewsletterService } from './newsletter.service';
import { SubscribeDto, UnsubscribeDto } from './dto/subscribe.dto';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(subscribeDto: SubscribeDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/subscriber.schema").SubscriberDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../schemas/subscriber.schema").Subscriber & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    unsubscribe(unsubscribeDto: UnsubscribeDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/subscriber.schema").SubscriberDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../schemas/subscriber.schema").Subscriber & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    unsubscribeViaGet(token: string): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/subscriber.schema").SubscriberDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../schemas/subscriber.schema").Subscriber & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    triggerDailyDigest(): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/newsletter.schema").NewsletterDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../schemas/newsletter.schema").Newsletter & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    trackOpen(newsletterId: string, res: Response): Promise<void>;
    trackClick(newsletterId: string, redirect: string, res: Response): Promise<void>;
}
