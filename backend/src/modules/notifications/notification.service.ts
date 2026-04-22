import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private readonly telegramToken: string;
    private readonly telegramChatId: string;
    private readonly adminEmail: string;

    constructor(private readonly configService: ConfigService) {
        this.telegramToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN')!;
        this.telegramChatId = this.configService.get<string>('TELEGRAM_CHAT_ID')!;
        this.adminEmail = this.configService.get<string>('NEWSLETTER_ADMIN_EMAIL')!;
    }

    async sendTelegramAlert(message: string) {
        if (!this.telegramToken || !this.telegramChatId) {
            this.logger.warn('Telegram notifications not configured.');
            return;
        }

        try {
            await axios.post(`https://api.telegram.org/bot${this.telegramToken}/sendMessage`, {
                chat_id: this.telegramChatId,
                text: `🚨 *NovaEdge Alert*\n\n${message}`,
                parse_mode: 'Markdown',
            });
            this.logger.log('Telegram alert sent successfully.');
        } catch (error) {
            this.logger.error('Failed to send Telegram alert', error.message);
        }
    }

    async sendEmailAlert(subject: string, body: string) {
        if (!this.adminEmail) {
            this.logger.warn('Admin email not configured for alerts.');
            return;
        }

        this.logger.log(`[EMAIL ALERT] To: ${this.adminEmail} | Subject: ${subject}`);
        // Here you would integrate with your existing mailer service or SendGrid
        // For now, logging to console as placeholder for the exact mailer implementation
        this.logger.debug(`Email Body: ${body}`);
    }

    async sendDailySummary(stats: any) {
        const message = `📈 *Daily System Summary*\n\n` +
            `- Newsletter Sent: ${stats.emailsSent}\n` +
            `- Articles Processed: ${stats.articlesProcessed}\n` +
            `- SEO Health: ${stats.healthStatus}\n` +
            `- Execution Time: ${stats.executionTimeMs}ms`;

        await this.sendTelegramAlert(message);
    }
}
