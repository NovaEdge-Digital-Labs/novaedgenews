"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const news_discovery_service_1 = require("../news-discovery/news-discovery.service");
const extractor_service_1 = require("../extractor/extractor.service");
const ai_service_1 = require("../ai/ai.service");
const qa_service_1 = require("../ai/qa.service");
const publisher_service_1 = require("../publisher/publisher.service");
const distribution_service_1 = require("../distribution/distribution.service");
const analytics_service_1 = require("../analytics/analytics.service");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    newsService;
    extractorService;
    aiService;
    qaService;
    publisherService;
    distributionService;
    analyticsService;
    logger = new common_1.Logger(SchedulerService_1.name);
    constructor(newsService, extractorService, aiService, qaService, publisherService, distributionService, analyticsService) {
        this.newsService = newsService;
        this.extractorService = extractorService;
        this.aiService = aiService;
        this.qaService = qaService;
        this.publisherService = publisherService;
        this.distributionService = distributionService;
        this.analyticsService = analyticsService;
    }
    async phase1NewsDiscovery() {
        try {
            this.logger.log('PHASE 1: Starting News Discovery...');
            const articles = await this.newsService.fetchAndStore();
            this.logger.log(`PHASE 1: Queued ${articles?.length || 0} articles`);
        }
        catch (error) {
            this.logger.error('PHASE 1 failed', error);
            await this.alertAdmin('News Discovery failed', error);
        }
    }
    async phase2ContentExtraction() {
        try {
            this.logger.log('PHASE 2: Starting Content Extraction...');
            const result = await this.extractorService.processQueue();
            this.logger.log(`PHASE 2: ${result?.success || 0} successful, ${result?.failed || 0} failed`);
        }
        catch (error) {
            this.logger.error('PHASE 2 failed', error);
            await this.alertAdmin('Content Extraction failed', error);
        }
    }
    async phase3AiRewriting() {
        try {
            this.logger.log('PHASE 3: Starting AI Rewriting...');
            const result = await this.aiService.processQueue();
            this.logger.log(`PHASE 3: Rewrote ${result?.count || 0} articles`);
        }
        catch (error) {
            this.logger.error('PHASE 3 failed', error);
            await this.alertAdmin('AI Rewriting failed', error);
        }
    }
    async phase4QualityAssurance() {
        try {
            this.logger.log('PHASE 4: Starting QA...');
            const result = await this.qaService.filterArticles();
            this.logger.log(`PHASE 4: ${result?.passed || 0} passed, ${result?.failed || 0} rejected`);
        }
        catch (error) {
            this.logger.error('PHASE 4 failed', error);
            await this.alertAdmin('QA failed', error);
        }
    }
    async phase5Publishing() {
        try {
            this.logger.log('PHASE 5: Starting Publishing...');
            const count = await this.publisherService.publishReadyArticles();
            this.logger.log(`PHASE 5: Published ${count || 0} articles`);
        }
        catch (error) {
            this.logger.error('PHASE 5 failed', error);
            await this.alertAdmin('Publishing failed', error);
        }
    }
    async phase6Distribution() {
        try {
            this.logger.log('PHASE 6: Starting Distribution...');
            const result = await this.distributionService.distributeAll();
            this.logger.log(`PHASE 6: Distributed to ${result?.channels || 0} channels`);
        }
        catch (error) {
            this.logger.error('PHASE 6 failed', error);
            await this.alertAdmin('Distribution failed', error);
        }
    }
    async phase7Analytics() {
        try {
            this.logger.log('PHASE 7: Updating Analytics...');
            await this.analyticsService.updateTrendingScores();
            await this.analyticsService.generateDailyReport();
            this.logger.log('PHASE 7: Complete');
        }
        catch (error) {
            this.logger.error('PHASE 7 failed', error);
            await this.alertAdmin('Analytics failed', error);
        }
    }
    async continuousHeadlineABTest() {
        try {
            await this.aiService.updateHeadlineTests();
        }
        catch (e) {
            this.logger.error('Headline Test update failed', e);
        }
    }
    async continuousTrendingUpdate() {
        try {
            await this.analyticsService.refreshTrendingList();
        }
        catch (e) {
            this.logger.error('Trending update failed', e);
        }
    }
    async alertAdmin(phase, error) {
        this.logger.error(`[ADMIN ALERT] Phase: ${phase} | Error: ${error.message}`);
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)('0 8 * * *', { timeZone: 'Asia/Kolkata' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "phase1NewsDiscovery", null);
__decorate([
    (0, schedule_1.Cron)('30 8 * * *', { timeZone: 'Asia/Kolkata' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "phase2ContentExtraction", null);
__decorate([
    (0, schedule_1.Cron)('0 9 * * *', { timeZone: 'Asia/Kolkata' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "phase3AiRewriting", null);
__decorate([
    (0, schedule_1.Cron)('30 9 * * *', { timeZone: 'Asia/Kolkata' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "phase4QualityAssurance", null);
__decorate([
    (0, schedule_1.Cron)('0 10 * * *', { timeZone: 'Asia/Kolkata' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "phase5Publishing", null);
__decorate([
    (0, schedule_1.Cron)('30 10 * * *', { timeZone: 'Asia/Kolkata' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "phase6Distribution", null);
__decorate([
    (0, schedule_1.Cron)('0 11 * * *', { timeZone: 'Asia/Kolkata' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "phase7Analytics", null);
__decorate([
    (0, schedule_1.Cron)('0 */6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "continuousHeadlineABTest", null);
__decorate([
    (0, schedule_1.Cron)('0 */6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "continuousTrendingUpdate", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [news_discovery_service_1.NewsDiscoveryService,
        extractor_service_1.ExtractorService,
        ai_service_1.AIService,
        qa_service_1.QAService,
        publisher_service_1.PublisherService,
        distribution_service_1.DistributionService,
        analytics_service_1.AnalyticsService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map