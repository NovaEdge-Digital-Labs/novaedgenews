import { Model } from 'mongoose';
import { ArticleDocument } from '../../schemas/article.schema';
import { AIService } from './ai.service';
export declare class HeadlineTestingService {
    private articleModel;
    private readonly aiService;
    private readonly logger;
    constructor(articleModel: Model<ArticleDocument>, aiService: AIService);
    generateVariants(articleId: string): Promise<any>;
    evaluateActiveTests(): Promise<void>;
}
