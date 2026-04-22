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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NewsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const news_service_1 = require("../modules/news/news.service");
const ai_service_1 = require("../modules/ai/ai.service");
const publisher_service_1 = require("../modules/publisher/publisher.service");
const analytics_service_1 = require("../modules/analytics/analytics.service");
const bullmq_2 = require("@nestjs/bullmq");
const bullmq_3 = require("bullmq");
const image_service_1 = require("../modules/image/image.service");
const distribution_service_1 = require("../modules/distribution/distribution.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rejection_schema_1 = require("../schemas/rejection.schema");
const article_schema_1 = require("../schemas/article.schema");
const extractor_service_1 = require("../modules/extractor/extractor.service");
const qa_service_1 = require("../modules/ai/qa.service");
const deep_analysis_service_1 = require("../modules/ai/deep-analysis.service");
const headline_testing_service_1 = require("../modules/ai/headline-testing.service");
let NewsProcessor = NewsProcessor_1 = class NewsProcessor extends bullmq_1.WorkerHost {
    newsService;
    extractorService;
    aiService;
    qaService;
    deepAnalysisService;
    headlineTestingService;
    publisherService;
    analyticsService;
    imageService;
    distributionService;
    rejectionModel;
    articleModel;
    queue;
    logger = new common_1.Logger(NewsProcessor_1.name);
    consecutiveFailures = 0;
    FAILURE_THRESHOLD = 5;
    constructor(newsService, extractorService, aiService, qaService, deepAnalysisService, headlineTestingService, publisherService, analyticsService, imageService, distributionService, rejectionModel, articleModel, queue) {
        super();
        this.newsService = newsService;
        this.extractorService = extractorService;
        this.aiService = aiService;
        this.qaService = qaService;
        this.deepAnalysisService = deepAnalysisService;
        this.headlineTestingService = headlineTestingService;
        this.publisherService = publisherService;
        this.analyticsService = analyticsService;
        this.imageService = imageService;
        this.distributionService = distributionService;
        this.rejectionModel = rejectionModel;
        this.articleModel = articleModel;
        this.queue = queue;
    }
    async process(job) {
        this.logger.log(`Processing job: ${job.name} (ID: ${job.id}) - Failures: ${this.consecutiveFailures}`);
        try {
            switch (job.name) {
                case 'fetch-news':
                    this.logger.log('Executing Step 1: News Discovery...');
                    await this.newsService.fetchAndProcessNews();
                    break;
                case 'extract-content':
                    this.logger.log('Executing Step 2: Content Extraction...');
                    const pending = await this.articleModel.find({ status: 'pending_extraction' }).limit(50).exec();
                    for (const art of pending) {
                        try {
                            const ext = await this.extractorService.extractContent(art.sourceUrl, art.title);
                            if (ext && ext.status === 'success') {
                                await this.articleModel.updateOne({ _id: art._id }, {
                                    $set: { content: ext.content, status: 'ready_for_rewrite', wordCount: ext.wordCount }
                                });
                            }
                            else {
                                await this.articleModel.updateOne({ _id: art._id }, {
                                    $set: { status: 'rejected', insight: ext.rejectionReason }
                                });
                            }
                        }
                        catch (e) {
                            this.logger.error(`Extraction failed: ${e.message}`);
                        }
                    }
                    break;
                case 'ai-rewrite':
                    this.logger.log('Executing Step 3: AI Rewriting...');
                    const ready = await this.articleModel.find({ status: 'ready_for_rewrite' }).limit(50).exec();
                    for (const art of ready) {
                        try {
                            const isDeep = art.wordCount > 1500;
                            const res = isDeep
                                ? await this.aiService.generateDeepAnalysis(art.title, art.content)
                                : await this.aiService.rewriteAsQuickNews(art.title, art.content);
                            await this.articleModel.updateOne({ _id: art._id }, {
                                $set: { ...res, status: 'ready_verify', isEditorial: isDeep }
                            });
                        }
                        catch (e) {
                            this.logger.error(`AI Rewrite failed: ${e.message}`);
                        }
                    }
                    break;
                case 'generate-deep-analysis':
                    this.logger.log(`Executing Targeted Deep Analysis for article: ${job.data.articleId}`);
                    const art = await this.articleModel.findById(job.data.articleId).exec();
                    if (!art) {
                        this.logger.warn(`Article ${job.data.articleId} not found for Deep Analysis`);
                        break;
                    }
                    if (art.deepAnalysis && art.deepAnalysis.status === 'generated') {
                        this.logger.log(`Deep Analysis already exists for article: ${art.title}`);
                        break;
                    }
                    try {
                        const analysis = await this.deepAnalysisService.generate(art.quickNews || art.summary, art.content);
                        await this.articleModel.updateOne({ _id: art._id }, {
                            $set: {
                                deepAnalysis: analysis,
                                articleType: art.articleType === 'quick_news' ? 'both' : art.articleType
                            }
                        });
                        this.logger.log(`Deep Analysis generated and saved for: ${art.title}`);
                    }
                    catch (e) {
                        this.logger.error(`Deep Analysis generation failed for ${art.title}: ${e.message}`);
                        await this.articleModel.updateOne({ _id: art._id }, {
                            $set: { 'deepAnalysis.status': 'failed' }
                        });
                    }
                    break;
                case 'quality-filter':
                    this.logger.log('Executing Step 4: Quality Filters...');
                    const toVerify = await this.articleModel.find({ status: 'ready_verify' }).exec();
                    for (const art of toVerify) {
                        const qa = await this.qaService.validateArticle(art, art.content);
                        if (qa.passed) {
                            await this.articleModel.updateOne({ _id: art._id }, { $set: { status: 'ready_publish' } });
                        }
                        else {
                            await this.logRejection(art, `QA Rejected: ${qa.issues.join(', ')}`);
                        }
                    }
                    break;
                case 'generate-variants':
                    this.logger.log('Executing step: Generating Headline Variants...');
                    const needVariants = await this.articleModel.find({
                        status: 'published',
                        headlineA: { $exists: false }
                    }).limit(20).exec();
                    for (const art of needVariants) {
                        try {
                            await this.headlineTestingService.generateVariants(art._id.toString());
                        }
                        catch (e) {
                            this.logger.error(`Variant generation failed for ${art._id}: ${e.message}`);
                        }
                    }
                    break;
                case 'auto-publish':
                    this.logger.log('Executing Step 5: Auto-Publish...');
                    const toPublish = await this.articleModel.find({ status: 'ready_publish' }).exec();
                    for (const art of toPublish) {
                        const published = await this.publisherService.publish(art);
                        if (published) {
                            await this.articleModel.updateOne({ _id: art._id }, { $set: { status: 'published' } });
                        }
                    }
                    break;
                case 'distribute-all':
                    this.logger.log('Executing Step 6: Distribution...');
                    const toDist = await this.articleModel.find({ status: 'published', distributed: { $ne: true } }).exec();
                    for (const art of toDist) {
                        await this.distributionService.distribute(art);
                        await this.articleModel.updateOne({ _id: art._id }, { $set: { distributed: true } });
                    }
                    break;
                case 'generate-daily-summary':
                    this.logger.log('Executing Step 7: Generating Daily Report...');
                    try {
                        const summary = await this.analyticsService.getDailyTrendingList();
                        this.logger.log(`Daily Summary: ${summary.totalViews} views, ${summary.totalClicks} clicks.`);
                    }
                    catch (e) {
                        this.logger.error('Daily Summary failed');
                    }
                    break;
                default:
                    this.logger.warn(`Unknown job name: ${job.name}`);
            }
        }
        catch (error) {
            this.consecutiveFailures++;
            this.logger.error(`Job ${job.name} failed (${this.consecutiveFailures}/${this.FAILURE_THRESHOLD})`, error.stack);
            throw error;
        }
    }
    async logRejection(data, reason) {
        this.logger.warn(`Rejection: ${reason} for ${data.title}`);
        try {
            await this.rejectionModel.create({
                originalTitle: data.title,
                reason,
                source: data.source,
                sourceUrl: data.sourceUrl,
                context: {
                    score: data.score,
                    wordCount: data.wordCount,
                    modelUsed: data.modelUsed
                }
            });
        }
        catch (error) {
            this.logger.error('Failed to log rejection to database', error.stack);
        }
    }
};
exports.NewsProcessor = NewsProcessor;
exports.NewsProcessor = NewsProcessor = NewsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('news-automation'),
    __param(10, (0, mongoose_1.InjectModel)(rejection_schema_1.Rejection.name)),
    __param(11, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __param(12, (0, bullmq_2.InjectQueue)('news-automation')),
    __metadata("design:paramtypes", [news_service_1.NewsService,
        extractor_service_1.ExtractorService,
        ai_service_1.AIService,
        qa_service_1.QAService,
        deep_analysis_service_1.DeepAnalysisService,
        headline_testing_service_1.HeadlineTestingService,
        publisher_service_1.PublisherService,
        analytics_service_1.AnalyticsService,
        image_service_1.ImageService,
        distribution_service_1.DistributionService,
        mongoose_2.Model,
        mongoose_2.Model,
        bullmq_3.Queue])
], NewsProcessor);
//# sourceMappingURL=news.processor.js.map