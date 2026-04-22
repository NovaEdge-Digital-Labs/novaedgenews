import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TwitterService } from './twitter.service';
import { FacebookService } from './facebook.service';
import { NewsletterService } from './newsletter.service';

@Injectable()
export class DistributionService {
    private readonly logger = new Logger(DistributionService.name);

    constructor(
        private readonly telegramService: TelegramService,
        private readonly twitterService: TwitterService,
        private readonly facebookService: FacebookService,
        private readonly newsletterService: NewsletterService,
    ) { }

    async distribute(article: any) {
        this.logger.log(`Broadcasting article to all platforms: ${article.slug}`);

        // Push in parallel
        const results = await Promise.allSettled([
            this.telegramService.distributeArticle(article),
            this.twitterService.sendArticle(article),
            this.facebookService.sendArticle(article),
            this.newsletterService.sendArticle(article),
        ]);

        this.logger.log(`Distribution complete for: ${article.slug}`);
        return results;
    }
}
