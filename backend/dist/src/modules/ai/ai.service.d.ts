import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
export declare class AIService {
    private readonly configService;
    private readonly logger;
    primaryClient: OpenAI;
    fallbackClient: OpenAI;
    constructor(configService: ConfigService);
    rewriteArticle(rawTitle: string, rawContent: string): Promise<any>;
    rewriteAsQuickNews(rawTitle: string, rawContent: string): Promise<any>;
    generateDeepAnalysis(quickSummary: string, originalContent: string): Promise<any>;
    generateAnalysis(rawTitle: string, rawContent: string): Promise<any>;
    private validateAndFilter;
    callAI(client: OpenAI, prompt: string, model: string): Promise<any>;
}
