import { Model } from 'mongoose';
import { ArticleDocument } from '../../schemas/article.schema';
import { AIService } from '../ai/ai.service';
import { ConfigService } from '@nestjs/config';
export declare class SeoService {
    private articleModel;
    private readonly aiService;
    private readonly configService;
    private readonly logger;
    constructor(articleModel: Model<ArticleDocument>, aiService: AIService, configService: ConfigService);
    generateSeoMetadata(articleId: string): Promise<ArticleDocument | null>;
    updateArticleSeo(articleId: string): Promise<ArticleDocument | null>;
    generateSitemap(): Promise<string>;
}
