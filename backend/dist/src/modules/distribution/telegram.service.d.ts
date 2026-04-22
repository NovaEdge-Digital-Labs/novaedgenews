import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
export declare class TelegramService {
    private readonly configService;
    private scheduleQueue;
    private readonly logger;
    private readonly baseUrl;
    constructor(configService: ConfigService, scheduleQueue: Queue);
    distributeArticle(article: any): Promise<void>;
    private formatMessage;
    private getChannelsForCategory;
    private sendWithRetry;
    scheduleDistribution(article: any): Promise<void>;
    private logDistribution;
    private alertOnFailure;
    private delay;
}
