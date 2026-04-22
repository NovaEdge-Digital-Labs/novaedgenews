import { AIService } from './ai.service';
import { QAService } from './qa.service';
export declare class AIController {
    private readonly aiService;
    private readonly qaService;
    private readonly logger;
    constructor(aiService: AIService, qaService: QAService);
    rewriteQuick(body: {
        title: string;
        content: string;
    }): Promise<any>;
    deepAnalysis(body: {
        quickSummary: string;
        originalContent: string;
    }): Promise<any>;
    verify(body: {
        article: any;
        sourceArticle: any;
    }): Promise<import("./qa.service").QAResult | {
        status: string;
        rejectionReason: string;
    }>;
}
