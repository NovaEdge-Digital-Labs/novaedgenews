import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { firstValueFrom } from 'rxjs';
import { calculateHash } from '../../utils/crypto';
import slugify from 'slugify';

@Injectable()
export class NewsDiscoveryService {
    private readonly logger = new Logger(NewsDiscoveryService.name);
    private readonly queries = ['technology', 'AI', 'startups', 'India tech'];

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async discoverNews() {
        this.logger.log('Starting news discovery process...');
        const apiKey = this.configService.get<string>('news.apiKey');
        if (!apiKey) {
            this.logger.error('News API key is missing');
            return { total: 0, articles: [] };
        }

        const allArticles: any[] = [];
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        for (const query of this.queries) {
            try {
                this.logger.log(`Fetching news for query: ${query}`);
                const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
                    query,
                )}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${apiKey}`;

                const response = await firstValueFrom(this.httpService.get<any>(url));
                const articles = response.data.articles || [];
                this.logger.log(`NewsAPI returned ${articles.length} articles for query: ${query}`);

                let queryProcessedCount = 0;

                for (const item of articles) {
                    // 1. Basic Filtering
                    if (!item.url || !item.title) {
                        this.logger.debug(`Skipping article with missing URL or title: ${item.title || 'no title'}`);
                        continue;
                    }

                    // 2. Age Filter (Older than 24 hours)
                    const publishedAt = new Date(item.publishedAt);
                    if (publishedAt < twentyFourHoursAgo) {
                        this.logger.debug(`Skipping old article: ${item.title} (published at ${item.publishedAt})`);
                        continue;
                    }

                    // 3. Duplicate check (by title)
                    const existing = await this.articleModel.findOne({ title: item.title });
                    if (existing) {
                        this.logger.debug(`Skipping duplicate title: ${item.title}`);
                        continue;
                    }

                    // 4. Transform
                    const rawContent = item.content || item.description || '';
                    const contentHash = calculateHash(rawContent);

                    // Generate a unique slug
                    const baseSlug = slugify(item.title, { lower: true, strict: true });
                    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

                    const categoryMapping: Record<string, string> = {
                        'technology': 'Technology',
                        'AI': 'AI',
                        'startups': 'Startups',
                        'India tech': 'India Tech'
                    };

                    const articleData = {
                        title: item.title,
                        source: item.source.name,
                        sourceUrl: item.url,
                        publishedAt: publishedAt,
                        image: item.urlToImage,
                        category: categoryMapping[query] || 'General',
                        status: 'pending_extraction',
                        contentHash,
                        slug,
                        summary: item.description || '',
                        content: rawContent,
                        aiMetadata: {
                            rawContent: rawContent,
                        },
                    };

                    // Save to database
                    const newArticle = new this.articleModel(articleData);
                    await newArticle.save();

                    allArticles.push({
                        title: item.title,
                        source: item.source.name,
                        url: item.url,
                        publishedAt: item.publishedAt,
                        image: item.urlToImage,
                        category: articleData.category,
                        status: 'pending_extraction',
                    });

                    queryProcessedCount++;
                }
                this.logger.log(`Processed ${queryProcessedCount} articles for query: ${query}`);
            } catch (error) {
                this.logger.error(`Error discovering news for query "${query}": ${error.message}`);
            }
        }

        this.logger.log(`Discovery complete. Stored ${allArticles.length} new articles.`);
        return {
            articles: allArticles,
            total: allArticles.length,
            timestamp: new Date().toISOString(),
        };
    }
}
