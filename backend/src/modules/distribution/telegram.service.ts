import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name);
    private readonly baseUrl = 'https://novaedge.news';

    constructor(
        private readonly configService: ConfigService,
        // Optional because the Bull queue might not be fully registered yet in the module depending on user configuration.
        // We will assert its existence later if missing.
        @InjectQueue('scheduleQueue') private scheduleQueue: Queue
    ) { }

    async distributeArticle(article: any): Promise<void> {
        try {
            // Format message
            const message = this.formatMessage(article);

            // Get channels based on category
            const channels = this.getChannelsForCategory(article.category);

            // Send to each channel with retry
            for (const channel of channels) {
                if (channel) {
                    await this.sendWithRetry(channel, message, article.mainImage || null);
                }
            }

            // Log distribution
            await this.logDistribution(article._id || article.id, channels);

        } catch (error: any) {
            this.logger.error(`Distribution failed for ${article._id || article.id}`, error);
            await this.alertOnFailure(article._id || article.id, error);
        }
    }

    private formatMessage(article: any): string {
        const type = article.deepAnalysis ? '📊' : '🔥';
        const headline = (article.headline || article.title || 'Breaking News').substring(0, 60);

        const summaryLimit = article.deepAnalysis ? 180 : 200;
        let summaryText = article.summary ? article.summary.substring(0, summaryLimit) : 'Check out this new update!';
        if (article.deepAnalysis) summaryText += '... Read the full deep analysis inside';

        const url = `${this.baseUrl}/articles/${article.slug || article._id}`;

        const tags = (article.tags || []).map((t: string) => `#${t.replace(/\s+/g, '')}`).join(' ');

        if (article.deepAnalysis) {
            return `${type} **${headline}**\n\n${summaryText}\n\nCategory: #${article.category || 'news'}\nDeep Dive: ${article.wordCount || 700}+ words\n\n[Read Full Analysis](${url}) | ${tags}`;
        }

        return `${type} **${headline}**\n\n${summaryText}\n\nCategory: #${article.category || 'news'}\n👁️ ${article.views || 0} views  |  🔗 ${article.clicks || 0} clicks\n\n[Read Full Article](${url}) | ${tags}`;
    }

    private getChannelsForCategory(category: string): string[] {
        const mainChannel = this.configService.get<string>('TELEGRAM_MAIN_CHANNEL') || this.configService.get<string>('TELEGRAM_CHAT_ID') || '';
        const categoryChannels: { [key: string]: string | undefined } = {
            'tech': this.configService.get<string>('TELEGRAM_TECH_CHANNEL'),
            'ai': this.configService.get<string>('TELEGRAM_AI_CHANNEL'),
            'startup': this.configService.get<string>('TELEGRAM_STARTUP_CHANNEL')
        };

        const targetCat = category ? category.toLowerCase() : '';
        const catChannel = categoryChannels[targetCat] || this.configService.get<string>(`TELEGRAM_CHAT_ID_${category?.toUpperCase()}`);

        return [mainChannel, catChannel as string].filter(Boolean);
    }

    private async sendWithRetry(
        channel: string,
        message: string,
        imageUrl: string | null,
        maxRetries: number = 3
    ): Promise<void> {
        const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
        if (!botToken) {
            this.logger.warn('TELEGRAM_BOT_TOKEN is not defined. Cannot send message.');
            return;
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const formData = new FormData();
                formData.append('chat_id', channel);
                formData.append('text', message);
                formData.append('parse_mode', 'Markdown');
                formData.append('disable_web_page_preview', 'false');

                if (imageUrl) {
                    formData.append('photo', imageUrl);
                    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                        method: 'POST',
                        body: formData as any,
                    });

                    if (!response.ok) {
                        // If sendPhoto failed, perhaps photo format is unsupported. Attempt fallback text send.
                        this.logger.warn(`Failed to sendPhoto to Telegram: ${response.statusText}. Retrying with sendMessage.`);
                        const formText = new FormData();
                        formText.append('chat_id', channel);
                        formText.append('text', message);
                        formText.append('parse_mode', 'Markdown');
                        formText.append('disable_web_page_preview', 'false');

                        const fallbackRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, { method: 'POST', body: formText as any });
                        if (!fallbackRes.ok) throw new Error(`Telegram API fallback error: ${fallbackRes.statusText}`);
                    }
                    return; // Success
                } else {
                    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                        method: 'POST',
                        body: formData as any,
                    });

                    if (!response.ok) {
                        throw new Error(`Telegram API error: ${response.statusText}`);
                    }

                    return; // Success
                }
            } catch (error) {
                if (attempt < maxRetries) {
                    await this.delay(Math.pow(2, attempt) * 1000);
                } else {
                    throw error;
                }
            }
        }
    }

    // SCHEDULING
    async scheduleDistribution(article: any): Promise<void> {
        if (!this.scheduleQueue) {
            this.logger.warn('Bull scheduleQueue is not injected. Skipping scheduling.');
            return;
        }

        const optimalTimes = ['9:00', '12:00', '17:00', '21:00']; // IST

        for (const time of optimalTimes) {
            await this.scheduleQueue.add(
                `distribute_${article._id || article.id}_${time}`,
                { articleId: article._id || article.id },
                {
                    repeat: {
                        pattern: `0 ${time.split(':')[0]} * * *` // Cron
                    }
                }
            );
        }
    }

    private async logDistribution(articleId: string, channels: string[]) {
        this.logger.log(`Successfully distributed Article[${articleId}] to channels: ${channels.join(', ')}`);
        // DB logging would traditionally occur here
    }

    private async alertOnFailure(articleId: string, error: Error) {
        this.logger.error(`Critical Final Failure for Article[${articleId}] Telegram propagation: ${error.message}`);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
