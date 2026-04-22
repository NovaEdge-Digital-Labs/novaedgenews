import { Model } from 'mongoose';
import { ArticleDocument } from '../../schemas/article.schema';
export declare class OptimizationService {
    private articleModel;
    private readonly logger;
    constructor(articleModel: Model<ArticleDocument>);
    optimizeHeadlines(): Promise<void>;
}
