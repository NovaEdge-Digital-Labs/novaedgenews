import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ArticleDocument } from '../../schemas/article.schema';
export declare class NewsService {
    private articleModel;
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    constructor(articleModel: Model<ArticleDocument>, httpService: HttpService, configService: ConfigService);
    fetchAndProcessNews(): Promise<never[] | undefined>;
}
