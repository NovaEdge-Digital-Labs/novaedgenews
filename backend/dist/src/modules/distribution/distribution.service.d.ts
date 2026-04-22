import { TelegramService } from './telegram.service';
import { TwitterService } from './twitter.service';
import { FacebookService } from './facebook.service';
import { NewsletterService } from './newsletter.service';
export declare class DistributionService {
    private readonly telegramService;
    private readonly twitterService;
    private readonly facebookService;
    private readonly newsletterService;
    private readonly logger;
    constructor(telegramService: TelegramService, twitterService: TwitterService, facebookService: FacebookService, newsletterService: NewsletterService);
    distribute(article: any): Promise<[PromiseSettledResult<void>, PromiseSettledResult<void>, PromiseSettledResult<void>, PromiseSettledResult<{
        platform: string;
        success: boolean;
        timestamp: string;
    }>]>;
}
