import { Model } from 'mongoose';
import { ArticleDocument } from '../../schemas/article.schema';
import { ConfigService } from '@nestjs/config';
export declare class SitemapService {
    private articleModel;
    private readonly configService;
    private readonly logger;
    constructor(articleModel: Model<ArticleDocument>, configService: ConfigService);
    generateSitemapXml(): Promise<string>;
    generateRobotsTxt(): Promise<string>;
}
