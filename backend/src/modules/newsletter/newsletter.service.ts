import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';
import { Subscriber, SubscriberDocument } from '../../schemas/subscriber.schema';
import { Newsletter, NewsletterDocument } from '../../schemas/newsletter.schema';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { NewsletterEvent, NewsletterEventDocument } from '../../schemas/newsletter-event.schema';

@Injectable()
export class NewsletterService {
    private readonly logger = new Logger(NewsletterService.name);
    private readonly baseUrl: string;

    constructor(
        @InjectModel(Subscriber.name) private subscriberModel: Model<SubscriberDocument>,
        @InjectModel(Newsletter.name) private newsletterModel: Model<NewsletterDocument>,
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        @InjectModel(NewsletterEvent.name) private newsletterEventModel: Model<NewsletterEventDocument>,
        private readonly configService: ConfigService,
    ) {
        const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
        if (apiKey) {
            sgMail.setApiKey(apiKey);
        } else {
            this.logger.warn('SENDGRID_API_KEY not found. Emails will not be sent.');
        }
        this.baseUrl = this.configService.get<string>('NEXT_PUBLIC_BASE_URL') || 'http://localhost:3000';
    }

    async subscribe(email: string, preferences?: any, source?: string) {
        const existing = await this.subscriberModel.findOne({ email });

        if (existing) {
            if (existing.status === 'subscribed' && existing.isConfirmed) {
                throw new ConflictException('Already subscribed and confirmed');
            }

            // Generate new confirmation token
            const confirmationToken = uuidv4();
            existing.confirmationToken = confirmationToken;
            existing.preferences = preferences || existing.preferences;
            existing.source = source || existing.source;
            await existing.save();

            await this.sendConfirmationEmail(existing.email, confirmationToken);
            return { message: 'Confirmation email sent' };
        }

        const confirmationToken = uuidv4();
        const subscriber = new this.subscriberModel({
            email,
            preferences,
            source: source || 'unknown',
            unsubscribeToken: uuidv4(),
            confirmationToken,
            isConfirmed: false,
            status: 'unsubscribed'
        });

        await subscriber.save();
        await this.sendConfirmationEmail(email, confirmationToken);

        return { message: 'Confirmation email sent' };
    }

    async confirmSubscription(token: string) {
        const subscriber = await this.subscriberModel.findOne({ confirmationToken: token });
        if (!subscriber) {
            throw new NotFoundException('Invalid confirmation token');
        }

        subscriber.status = 'subscribed';
        subscriber.isConfirmed = true;
        subscriber.confirmationToken = undefined;
        await subscriber.save();

        return { message: 'Subscription confirmed successfully' };
    }

    async unsubscribe(token: string) {
        const subscriber = await this.subscriberModel.findOne({ unsubscribeToken: token });
        if (!subscriber) {
            throw new NotFoundException('Invalid unsubscribe token'); // Or silently ignore
        }

        subscriber.status = 'unsubscribed';
        subscriber.engagementMetrics.unsubscribeDate = new Date();
        return await subscriber.save();
    }

    private async sendConfirmationEmail(email: string, token: string) {
        const confirmUrl = `${this.baseUrl}/newsletter/confirm?token=${token}`;

        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Confirm your subscription to NovaEdge News</h2>
                <p>Please confirm your subscription to start receiving the latest tech and AI news.</p>
                <div style="margin: 30px 0;">
                    <a href="${confirmUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirm Subscription</a>
                </div>
                <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        `;

        try {
            await sgMail.send({
                to: email,
                from: 'newsletter@novaedge.in',
                subject: 'Confirm your NovaEdge News subscription',
                html,
            });
        } catch (error) {
            this.logger.error(`Failed to send confirmation to ${email}`, error.stack);
        }
    }

    async sendDailyDigest() {
        this.logger.log('Generating daily digest...');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const articles = await this.articleModel.find({
            publishedAt: { $gte: today },
            status: 'published'
        })
            .sort({ trendingScore: -1, performanceScore: -1, views: -1 })
            .limit(10);

        if (articles.length === 0) {
            this.logger.log('No articles found for daily digest today.');
            return;
        }

        const subscribers = await this.subscriberModel.find({
            status: 'subscribed',
            isConfirmed: true,
            'preferences.receiveDigests': true
        });

        if (subscribers.length === 0) {
            this.logger.log('No active/confirmed subscribers found.');
            return;
        }

        const subject = `NovaEdge News Daily Digest - ${new Date().toLocaleDateString()}`;

        // Create Newsletter record first to get the ID for tracking
        const newsletter = await this.newsletterModel.create({
            subject,
            sentDate: new Date(),
            status: 'sending',
            articlesIncluded: articles.map(a => a._id),
            audience: {
                targetCount: subscribers.length,
                segment: 'all-daily-digests'
            }
        });

        const customArgs = {
            newsletterId: newsletter._id.toString()
        };

        let delivered = 0;

        for (const sub of subscribers) {
            try {
                const html = this.generateHtml(articles, sub.unsubscribeToken, newsletter._id.toString());

                await sgMail.send({
                    to: sub.email,
                    from: 'newsletter@novaedge.in',
                    subject,
                    html,
                    customArgs, // SendGrid webhook tracks this custom argument
                });

                delivered++;

                // Keep minimal internal engagement metrics
                sub.engagementMetrics.totalEmails += 1;
                await sub.save();

            } catch (error) {
                this.logger.error(`Failed to send newsletter to ${sub.email}`, error.stack);
            }
        }

        // Update Newsletter Record status
        newsletter.status = 'sent';
        newsletter.metrics.delivered = delivered;
        await newsletter.save();

        this.logger.log(`Daily digest sent to ${delivered}/${subscribers.length} subscribers.`);
        return newsletter;
    }

    private generateHtml(articles: any[], unsubscribeToken: string, newsletterId: string): string {
        const apiBaseUrl = this.configService.get<string>('API_URL') || 'http://localhost:3005';

        const articleItems = articles.map(a => {
            return `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <h3 style="margin: 0;"><a href="${this.baseUrl}/articles/${a.slug}" style="color: #0070f3; text-decoration: none;">${a.title}</a></h3>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">${a.summary}</p>
                <span style="background: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${a.category}</span>
            </div>
        `;
        }).join('');

        // Provide link to Unsubscribe
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h1 style="text-align: center; color: #333;">NovaEdge News</h1>
                <p style="text-align: center; color: #999;">Your Daily Tech & AI Update</p>
                <hr />
                ${articleItems}
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
                    <p>You are receiving this because you subscribed to NovaEdge News.</p>
                    <a href="${this.baseUrl}/newsletter/unsubscribe?token=${unsubscribeToken}" style="color: #999;">Unsubscribe</a>
                </div>
            </div>
        `;
    }

    async processWebhook(events: any[]) {
        for (const event of events) {
            const { email, event: eventType, timestamp, url, ip, useragent, newsletterId, sg_message_id } = event;

            if (!email || !newsletterId) continue; // Not our tracked payload

            try {
                // 1. Create standard NewsletterEvent
                await this.newsletterEventModel.create({
                    email,
                    newsletterId,
                    event: eventType,
                    timestamp: new Date(timestamp * 1000),
                    url,
                    ip,
                    userAgent: useragent,
                    sendgridMessageId: sg_message_id,
                    rawPayload: event
                });

                // 2. Roll up metrics to Newsletter
                const incObj: any = {};
                if (eventType === 'delivered') incObj['metrics.delivered'] = 1;
                if (eventType === 'open') incObj['metrics.opens'] = 1; // Uniques are harder, rough metric for now
                if (eventType === 'click') incObj['metrics.clicks'] = 1;
                if (eventType === 'bounce') incObj['metrics.bounces'] = 1;
                if (eventType === 'spamreport') incObj['metrics.spamReports'] = 1;
                if (eventType === 'unsubscribe') incObj['metrics.unsubscribes'] = 1;

                if (Object.keys(incObj).length > 0) {
                    await this.newsletterModel.findByIdAndUpdate(newsletterId, { $inc: incObj });
                }

                // 3. Roll up metrics to Subscriber
                if (['open', 'click', 'bounce', 'spamreport', 'unsubscribe'].includes(eventType)) {
                    const subscriber = await this.subscriberModel.findOne({ email });
                    if (subscriber) {
                        if (eventType === 'open') {
                            subscriber.engagementMetrics.openCount += 1;
                            subscriber.engagementMetrics.lastOpenDate = new Date(timestamp * 1000);
                        }
                        if (eventType === 'click') {
                            subscriber.engagementMetrics.clickCount += 1;
                            subscriber.engagementMetrics.lastClickDate = new Date(timestamp * 1000);
                        }
                        if (eventType === 'bounce' || eventType === 'spamreport' || eventType === 'unsubscribe') {
                            subscriber.status = eventType === 'bounce' ? 'bounced' : 'unsubscribed';
                            subscriber.engagementMetrics.unsubscribeDate = new Date(timestamp * 1000);
                        }

                        // Recalculate Rates
                        if (subscriber.engagementMetrics.totalEmails > 0) {
                            subscriber.engagementMetrics.openRate = subscriber.engagementMetrics.openCount / subscriber.engagementMetrics.totalEmails;
                            subscriber.engagementMetrics.clickRate = subscriber.engagementMetrics.clickCount / subscriber.engagementMetrics.totalEmails;
                        }

                        await subscriber.save();
                    }
                }

            } catch (error) {
                this.logger.error(`Failed to process SendGrid webhook event for ${email}`, error.stack);
            }
        }
        return { success: true };
    }

    async generateWeeklyReport(): Promise<any> {
        this.logger.log('Generating weekly newsletter analytics...');
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const newsletters = await this.newsletterModel.find({
            sentDate: { $gte: oneWeekAgo }
        }).exec();

        const totalSent = newsletters.reduce((acc, curr) => acc + (curr.metrics?.delivered || 0), 0);
        const totalOpens = newsletters.reduce((acc, curr) => acc + (curr.metrics?.opens || 0), 0);
        const totalClicks = newsletters.reduce((acc, curr) => acc + (curr.metrics?.clicks || 0), 0);

        const report = {
            period: 'weekly',
            startDate: oneWeekAgo,
            endDate: new Date(),
            newslettersSent: newsletters.length,
            totalAudienceTargeted: Math.max(...newsletters.map(n => n.audience?.targetCount || 0), 0),
            totalDelivered: totalSent,
            totalOpens,
            totalClicks,
            averageOpenRate: totalSent > 0 ? (totalOpens / totalSent) * 100 : 0,
            averageClickRate: totalSent > 0 ? (totalClicks / totalSent) * 100 : 0,
        };

        this.logger.log(`Weekly report generated: ${report.newslettersSent} newsletters, ${report.averageOpenRate.toFixed(2)}% open rate`);
        return report;
    }
}
