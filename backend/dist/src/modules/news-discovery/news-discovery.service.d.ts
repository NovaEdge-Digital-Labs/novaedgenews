import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ArticleDocument } from '../../schemas/article.schema';
export declare class NewsDiscoveryService {
    private articleModel;
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly queries;
    constructor(articleModel: Model<ArticleDocument>, httpService: HttpService, configService: ConfigService);
    discoverNews(): Promise<{
        total: number;
        articles: never[];
        timestamp?: undefined;
    } | {
        articles: any[];
        total: number;
        timestamp: string;
    }>;
}
