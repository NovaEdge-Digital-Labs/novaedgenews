import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { NewsService } from '../modules/news/news.service';
import { AIService } from '../modules/ai/ai.service';
import { PublisherService } from '../modules/publisher/publisher.service';
import { AnalyticsService } from '../modules/analytics/analytics.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ImageService } from '../modules/image/image.service';
import { DistributionService } from '../modules/distribution/distribution.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rejection, RejectionDocument } from '../schemas/rejection.schema';
import { Article, ArticleDocument } from '../schemas/article.schema';
import { ExtractorService } from '../modules/extractor/extractor.service';
import { QAService } from '../modules/ai/qa.service';
import { DeepAnalysisService } from '../modules/ai/deep-analysis.service';
import { HeadlineTestingService } from '../modules/ai/headline-testing.service';

@Processor('news-automation')
export class NewsProcessor extends WorkerHost {
    private readonly logger = new Logger(NewsProcessor.name);
    private consecutiveFailures = 0;
    private readonly FAILURE_THRESHOLD = 5;

    constructor(
        private readonly newsService: NewsService,
        private readonly extractorService: ExtractorService,
        private readonly aiService: AIService,
        private readonly qaService: QAService,
        private readonly deepAnalysisService: DeepAnalysisService,
        private readonly headlineTestingService: HeadlineTestingService,
        private readonly publisherService: PublisherService,
        private readonly analyticsService: AnalyticsService,
        private readonly imageService: ImageService,
        private readonly distributionService: DistributionService,
        @InjectModel(Rejection.name) private readonly rejectionModel: Model<RejectionDocument>,
        @InjectModel(Article.name) private readonly articleModel: Model<ArticleDocument>,
        @InjectQueue('news-automation') private readonly queue: Queue,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
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
                            const ext = await this.extractorService.extractContent(art.sourceUrl, art.title) as any;
                            if (ext && ext.status === 'success') {
                                await this.articleModel.updateOne({ _id: art._id }, {
                                    $set: { content: ext.content, status: 'ready_for_rewrite', wordCount: ext.wordCount }
                                });
                            } else {
                                await this.articleModel.updateOne({ _id: art._id }, {
                                    $set: { status: 'rejected', insight: ext.rejectionReason }
                                });
                            }
                        } catch (e) {
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
                        } catch (e) {
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
                    } catch (e) {
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
                        const qa = await this.qaService.validateArticle(art as any, art.content);
                        if (qa.passed) {
                            await this.articleModel.updateOne({ _id: art._id }, { $set: { status: 'ready_publish' } });
                        } else {
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
                        } catch (e) {
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
                    } catch (e) {
                        this.logger.error('Daily Summary failed');
                    }
                    break;

                default:
                    this.logger.warn(`Unknown job name: ${job.name}`);
            }
        } catch (error) {
            this.consecutiveFailures++;
            this.logger.error(`Job ${job.name} failed (${this.consecutiveFailures}/${this.FAILURE_THRESHOLD})`, error.stack);
            throw error; // Let BullMQ handle retries if configured
        }
    }

    private async logRejection(data: any, reason: string) {
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
        } catch (error) {
            this.logger.error('Failed to log rejection to database', error.stack);
        }
    }
}
