import { AIService } from './ai.service';
export declare class DeepAnalysisService {
    private readonly aiService;
    private readonly logger;
    constructor(aiService: AIService);
    generate(quickNews: string, originalContent: string): Promise<any>;
}
