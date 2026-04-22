import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { firstValueFrom } from 'rxjs';
import { similarityScore } from '../../utils/text';
import { calculateHash } from '../../utils/crypto';

@Injectable()
export class NewsService {
    private readonly logger = new Logger(NewsService.name);

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async fetchAndProcessNews() {
        this.logger.log('Starting news fetch process...');
        try {
            const apiKey = this.configService.get<string>('news.apiKey');
            const response = await firstValueFrom(
                this.httpService.get<any>(`https://newsapi.org/v2/top-headlines?language=en&apiKey=${apiKey}`)
            );

            const articles = response.data.articles;
            const newProcessedCount = 0;

            for (const item of articles) {
                const rawContent = item.content || item.description || '';
                const contentHash = calculateHash(rawContent);

                const exists = await this.articleModel.findOne({
                    $or: [{ sourceUrl: item.url }, { contentHash }]
                });
                if (exists) continue;

                await this.articleModel.create({
                    title: item.title,
                    summary: item.description,
                    content: rawContent,
                    image: item.urlToImage,
                    source: item.source.name,
                    sourceUrl: item.url,
                    publishedAt: new Date(item.publishedAt),
                    status: 'pending_extraction',
                    contentHash,
                });
            }

            this.logger.log(`Discovery complete. Articles are now in pending_extraction status.`);
        } catch (error) {
            this.logger.error('Failed to fetch news', error.stack);
            return [];
        }
    }
}
