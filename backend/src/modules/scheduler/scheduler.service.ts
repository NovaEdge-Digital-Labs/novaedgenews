import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { NewsDiscoveryService } from '../news-discovery/news-discovery.service';
import { ExtractorService } from '../extractor/extractor.service';
import { AIService } from '../ai/ai.service';
import { QAService } from '../ai/qa.service';
import { PublisherService } from '../publisher/publisher.service';
import { DistributionService } from '../distribution/distribution.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { NewsletterService } from '../newsletter/newsletter.service';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        private newsService: NewsDiscoveryService,
        private extractorService: ExtractorService,
        private aiService: AIService,
        private qaService: QAService,
        private publisherService: PublisherService,
        private distributionService: DistributionService,
        private analyticsService: AnalyticsService,
        private newsletterService: NewsletterService
    ) { }

    @Cron('0 8 * * *', { timeZone: 'Asia/Kolkata' })
    async phase1NewsDiscovery() {
        try {
            this.logger.log('PHASE 1: Starting News Discovery...');
            const articles = await (this.newsService as any).fetchAndStore();
            this.logger.log(`PHASE 1: Queued ${articles?.length || 0} articles`);
        } catch (error: any) {
            this.logger.error('PHASE 1 failed', error);
            await this.alertAdmin('News Discovery failed', error);
        }
    }

    @Cron('30 8 * * *', { timeZone: 'Asia/Kolkata' })
    async phase2ContentExtraction() {
        try {
            this.logger.log('PHASE 2: Starting Content Extraction...');
            const result = await (this.extractorService as any).processQueue();
            this.logger.log(`PHASE 2: ${result?.success || 0} successful, ${result?.failed || 0} failed`);
        } catch (error: any) {
            this.logger.error('PHASE 2 failed', error);
            await this.alertAdmin('Content Extraction failed', error);
        }
    }

    @Cron('0 9 * * *', { timeZone: 'Asia/Kolkata' })
    async phase3AiRewriting() {
        try {
            this.logger.log('PHASE 3: Starting AI Rewriting...');
            const result = await (this.aiService as any).processQueue();
            this.logger.log(`PHASE 3: Rewrote ${result?.count || 0} articles`);
        } catch (error: any) {
            this.logger.error('PHASE 3 failed', error);
            await this.alertAdmin('AI Rewriting failed', error);
        }
    }

    @Cron('30 9 * * *', { timeZone: 'Asia/Kolkata' })
    async phase4QualityAssurance() {
        try {
            this.logger.log('PHASE 4: Starting QA...');
            const result = await (this.qaService as any).filterArticles();
            this.logger.log(`PHASE 4: ${result?.passed || 0} passed, ${result?.failed || 0} rejected`);
        } catch (error: any) {
            this.logger.error('PHASE 4 failed', error);
            await this.alertAdmin('QA failed', error);
        }
    }

    @Cron('0 10 * * *', { timeZone: 'Asia/Kolkata' })
    async phase5Publishing() {
        try {
            this.logger.log('PHASE 5: Starting Publishing...');
            const count = await (this.publisherService as any).publishReadyArticles();
            this.logger.log(`PHASE 5: Published ${count || 0} articles`);
        } catch (error: any) {
            this.logger.error('PHASE 5 failed', error);
            await this.alertAdmin('Publishing failed', error);
        }
    }

    @Cron('30 10 * * *', { timeZone: 'Asia/Kolkata' })
    async phase6Distribution() {
        try {
            this.logger.log('PHASE 6: Starting Distribution...');
            const result = await (this.distributionService as any).distributeAll();
            this.logger.log(`PHASE 6: Distributed to ${result?.channels || 0} channels`);
        } catch (error: any) {
            this.logger.error('PHASE 6 failed', error);
            await this.alertAdmin('Distribution failed', error);
        }
    }

    @Cron('0 11 * * *', { timeZone: 'Asia/Kolkata' })
    async phase7Analytics() {
        try {
            this.logger.log('PHASE 7: Updating Analytics...');
            await (this.analyticsService as any).updateTrendingScores();
            await (this.analyticsService as any).generateDailyReport();
            this.logger.log('PHASE 7: Complete');
        } catch (error: any) {
            this.logger.error('PHASE 7 failed', error);
            await this.alertAdmin('Analytics failed', error);
        }
    }

    @Cron('0 7 * * *', { timeZone: 'Asia/Kolkata' })
    async phase0Newsletter() {
        try {
            this.logger.log('PHASE 0: Generating and Sending Daily Newsletter...');
            await (this.newsletterService as any).sendDailyDigest();
            this.logger.log('PHASE 0: Complete');
        } catch (error: any) {
            this.logger.error('PHASE 0 failed', error);
            await this.alertAdmin('Newsletter failed', error);
        }
    }

    // CONTINUOUS TASKS (Every 6 hours)
    @Cron('0 */6 * * *')
    async continuousHeadlineABTest() {
        try {
            await (this.aiService as any).updateHeadlineTests();
        } catch (e: any) {
            this.logger.error('Headline Test update failed', e);
        }
    }

    @Cron('0 */6 * * *')
    async continuousTrendingUpdate() {
        try {
            await (this.analyticsService as any).refreshTrendingList();
        } catch (e: any) {
            this.logger.error('Trending update failed', e);
        }
    }

    // ADMIN ALERTS
    private async alertAdmin(phase: string, error: Error) {
        this.logger.error(`[ADMIN ALERT] Phase: ${phase} | Error: ${error.message}`);
        // Send Telegram alert
        // Send email alert
        // Log to monitoring system natively here
    }
}
