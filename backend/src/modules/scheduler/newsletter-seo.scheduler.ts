import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SeoService } from '../seo/seo.service';
import { NewsletterService } from '../newsletter/newsletter.service';
import { NotificationService } from '../notifications/notification.service';
import { NewsletterSeoLog, NewsletterSeoLogDocument } from '../../schemas/newsletter-seo-log.schema';

@Injectable()
export class NewsletterSeoScheduler {
    private readonly logger = new Logger(NewsletterSeoScheduler.name);

    constructor(
        private readonly seoService: SeoService,
        private readonly newsletterService: NewsletterService,
        private readonly notificationService: NotificationService,
        @InjectModel(NewsletterSeoLog.name) private readonly logModel: Model<NewsletterSeoLogDocument>
    ) { }

    // 6:00 AM IST - Pre-Newsletter Checks
    @Cron('0 6 * * *', { timeZone: 'Asia/Kolkata' })
    async preNewsletterSync() {
        const startTime = Date.now();
        this.logger.log('PHASE: Pre-Newsletter Checks starting...');
        const logEntries: string[] = ['Starting pre-newsletter synchronization...'];

        try {
            const result = await this.seoService.validateAllArticles();
            logEntries.push(`Validated ${result.processed} articles, fixed ${result.fixed} missing SEO data.`);

            await this.saveLog('pre_newsletter_check', 'success', {
                articlesProcessed: result.processed,
                articlesFixed: result.fixed,
                executionTimeMs: Date.now() - startTime
            }, logEntries);

            this.logger.log('PHASE: Pre-Newsletter Checks completed successfully.');
        } catch (error) {
            this.logger.error('PHASE: Pre-Newsletter Checks failed', error);
            logEntries.push(`Error: ${error.message}`);
            await this.saveLog('pre_newsletter_check', 'failed', {
                executionTimeMs: Date.now() - startTime,
                errors: [error.message]
            }, logEntries);
            await this.alertAdmin('Pre-Newsletter Sync failed', error);
        }
    }

    // 7:00 AM IST - Newsletter Send
    @Cron('0 7 * * *', { timeZone: 'Asia/Kolkata' })
    async newsletterDispatch() {
        const startTime = Date.now();
        this.logger.log('PHASE: Newsletter Send starting...');
        const logEntries: string[] = ['Starting newsletter dispatch...'];

        try {
            const newsletter = await this.newsletterService.sendDailyDigest();
            const sentCount = newsletter?.metrics?.delivered || 0;
            logEntries.push(`Sent daily digest to ${sentCount} subscribers.`);

            await this.saveLog('newsletter_send', sentCount > 0 ? 'success' : 'partial', {
                emailsSent: sentCount,
                executionTimeMs: Date.now() - startTime
            }, logEntries);

            this.logger.log('PHASE: Newsletter Send completed.');
        } catch (error) {
            this.logger.error('PHASE: Newsletter Send failed', error);
            logEntries.push(`Error: ${error.message}`);
            await this.saveLog('newsletter_send', 'failed', {
                executionTimeMs: Date.now() - startTime,
                errors: [error.message]
            }, logEntries);
            await this.alertAdmin('Newsletter Dispatch failed', error);
        }
    }

    // 11:30 AM IST - Update Sitemap
    @Cron('30 11 * * *', { timeZone: 'Asia/Kolkata' })
    async sitemapSync() {
        const startTime = Date.now();
        this.logger.log('PHASE: Sitemap Sync starting...');
        const logEntries: string[] = ['Starting sitemap generation and sync...'];

        try {
            const result = await this.seoService.generateAndSubmitSitemap();
            logEntries.push(`Sitemap updated with ${result.entries} entries.`);

            await this.saveLog('sitemap_sync', result.status, {
                sitemapEntries: result.entries,
                executionTimeMs: Date.now() - startTime
            }, logEntries);

            this.logger.log('PHASE: Sitemap Sync completed.');
        } catch (error) {
            this.logger.error('PHASE: Sitemap Sync failed', error);
            logEntries.push(`Error: ${error.message}`);
            await this.saveLog('sitemap_sync', 'failed', {
                executionTimeMs: Date.now() - startTime,
                errors: [error.message]
            }, logEntries);
            await this.alertAdmin('Sitemap Sync failed', error);
        }
    }

    // 12:00 PM IST - SEO Health Check
    @Cron('0 12 * * *', { timeZone: 'Asia/Kolkata' })
    async seoHealthCheck() {
        const startTime = Date.now();
        this.logger.log('PHASE: SEO Health Check starting...');
        const logEntries: string[] = ['Starting SEO health check...'];

        try {
            const health = await this.seoService.performHealthCheck();
            logEntries.push(`Health Check: ${health.status}. Coverage: ${health.coverage.toFixed(2)}%`);

            await this.saveLog('seo_health_check', health.status === 'healthy' ? 'success' : 'partial', {
                articlesProcessed: health.totalPublished,
                articlesFixed: 0,
                executionTimeMs: Date.now() - startTime
            }, logEntries);

            if (health.status !== 'healthy') {
                await this.alertAdmin('SEO Health degraded', new Error(`SEO coverage is at ${health.coverage.toFixed(2)}%`));
            }

            this.logger.log('PHASE: SEO Health Check completed.');
        } catch (error) {
            this.logger.error('PHASE: SEO Health Check failed', error);
            logEntries.push(`Error: ${error.message}`);
            await this.saveLog('seo_health_check', 'failed', {
                executionTimeMs: Date.now() - startTime,
                errors: [error.message]
            }, logEntries);
            await this.alertAdmin('SEO Health Check failed', error);
        }
    }

    // 6:00 PM IST Sunday - Weekly Analytics
    @Cron('0 18 * * 0', { timeZone: 'Asia/Kolkata' })
    async weeklyAnalytics() {
        const startTime = Date.now();
        this.logger.log('PHASE: Weekly Analytics starting...');
        const logEntries: string[] = ['Starting weekly analytics compilation...'];

        try {
            const report = await this.newsletterService.generateWeeklyReport();
            logEntries.push(`Weekly Analytics: ${report.newslettersSent} newsletters sent. Avg Open Rate: ${report.averageOpenRate.toFixed(2)}%`);

            await this.saveLog('weekly_analytics', 'success', {
                executionTimeMs: Date.now() - startTime
            }, logEntries);

            this.logger.log('PHASE: Weekly Analytics completed.');
        } catch (error) {
            this.logger.error('PHASE: Weekly Analytics failed', error);
            logEntries.push(`Error: ${error.message}`);
            await this.saveLog('weekly_analytics', 'failed', {
                executionTimeMs: Date.now() - startTime,
                errors: [error.message]
            }, logEntries);
            await this.alertAdmin('Weekly Analytics failed', error);
        }
    }

    private async saveLog(phase: string, status: string, metrics: any, logs: string[]) {
        try {
            await this.logModel.create({
                timestamp: new Date(),
                phase,
                status,
                metrics,
                logs,
                alertsSent: {
                    telegram: status === 'failed' || status === 'partial',
                    email: status === 'failed'
                }
            });
        } catch (e) {
            this.logger.error('Failed to save NewsletterSeoLog', e);
        }
    }

    private async alertAdmin(subject: string, error: Error) {
        this.logger.error(`[ADMIN ALERT] ${subject}: ${error.message}`);

        const message = `*${subject}*\nError: ${error.message}`;
        await this.notificationService.sendTelegramAlert(message);

        if (subject.includes('failed')) {
            await this.notificationService.sendEmailAlert(subject, error.message);
        }
    }
}
