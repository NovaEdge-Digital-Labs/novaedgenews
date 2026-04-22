import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TwitterService {
    private readonly logger = new Logger(TwitterService.name);
    private readonly baseUrl = 'https://novaedge.news';

    constructor(private readonly configService: ConfigService) { }

    async sendArticle(article: any) {
        const apiKey = this.configService.get<string>('TWITTER_API_KEY');
        const accessToken = this.configService.get<string>('TWITTER_ACCESS_TOKEN');

        if (!apiKey || !accessToken) {
            this.logger.warn('Twitter credentials not configured. Skipping push.');
            return;
        }

        const tweetText = `🚀 ${article.title}\n\n${article.summary.substring(0, 150)}...\n\nRead more: ${this.baseUrl}/articles/${article.slug}`;

        try {
            // Note: This requires Twitter API v2
            // In a real production app, we would use a library like 'twitter-api-v2'
            // For now, illustrating with a placeholder call or simplified logic
            this.logger.log(`Simulated Twitter push for: ${article.slug}`);
            // await axios.post('https://api.twitter.com/2/tweets', { text: tweetText }, { headers: { ... } });
        } catch (error) {
            this.logger.error(`Failed to push to Twitter: ${error.message}`);
        }
    }
}
