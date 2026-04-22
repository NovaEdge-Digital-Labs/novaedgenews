import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class FacebookService {
    private readonly logger = new Logger(FacebookService.name);
    private readonly baseUrl = 'https://novaedge.news';

    constructor(private readonly configService: ConfigService) { }

    async sendArticle(article: any) {
        const pageId = this.configService.get<string>('FACEBOOK_PAGE_ID');
        const accessToken = this.configService.get<string>('FACEBOOK_PAGE_ACCESS_TOKEN');

        if (!pageId || !accessToken) {
            this.logger.warn('Facebook credentials not configured. Skipping push.');
            return;
        }

        const message = `🚀 ${article.title}\n\n${article.summary}\n\nRead more at ${this.baseUrl}/articles/${article.slug}`;

        try {
            await axios.post(`https://graph.facebook.com/${pageId}/feed`, {
                message,
                link: `${this.baseUrl}/articles/${article.slug}`,
                access_token: accessToken,
            });
            this.logger.log(`Successfully pushed article to Facebook: ${article.slug}`);
        } catch (error) {
            this.logger.error(`Failed to push to Facebook: ${error.message}`);
        }
    }
}
