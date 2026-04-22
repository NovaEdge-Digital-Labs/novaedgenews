import { AIService } from './ai.service';
export interface QAResult {
    articleId?: string;
    passed: boolean;
    score: number;
    issues: string[];
    confidence: number;
    recommendation: 'publish' | 'reject';
}
export declare class QAService {
    private readonly aiService;
    private readonly logger;
    constructor(aiService: AIService);
    validateArticle(article: any, sourceArticle: any): Promise<QAResult>;
    private calculateMetrics;
    private countSyllables;
    private performAICheck;
}
