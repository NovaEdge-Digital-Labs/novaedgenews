import { NewsDiscoveryService } from '../news-discovery/news-discovery.service';
import { ExtractorService } from '../extractor/extractor.service';
import { AIService } from '../ai/ai.service';
import { QAService } from '../ai/qa.service';
import { PublisherService } from '../publisher/publisher.service';
import { DistributionService } from '../distribution/distribution.service';
import { AnalyticsService } from '../analytics/analytics.service';
export declare class SchedulerService {
    private newsService;
    private extractorService;
    private aiService;
    private qaService;
    private publisherService;
    private distributionService;
    private analyticsService;
    private readonly logger;
    constructor(newsService: NewsDiscoveryService, extractorService: ExtractorService, aiService: AIService, qaService: QAService, publisherService: PublisherService, distributionService: DistributionService, analyticsService: AnalyticsService);
    phase1NewsDiscovery(): Promise<void>;
    phase2ContentExtraction(): Promise<void>;
    phase3AiRewriting(): Promise<void>;
    phase4QualityAssurance(): Promise<void>;
    phase5Publishing(): Promise<void>;
    phase6Distribution(): Promise<void>;
    phase7Analytics(): Promise<void>;
    continuousHeadlineABTest(): Promise<void>;
    continuousTrendingUpdate(): Promise<void>;
    private alertAdmin;
}
