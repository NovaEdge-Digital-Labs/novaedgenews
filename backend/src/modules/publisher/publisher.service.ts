import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import slugify from 'slugify';
import { countWords, calculateReadingTime } from '../../utils/text';

@Injectable()
export class PublisherService {
    private readonly logger = new Logger(PublisherService.name);

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    ) { }

    async publish(data: any) {
        const title = data.title || data.titleA;
        const summary = data.summary;
        const content = data.content;

        if (!title || !content || !summary) {
            this.logger.error(`Missing core fields for article: ${title || 'unknown'}`);
            return null;
        }

        this.logger.log(`Publishing article: ${title}`);

        const slug = data.slug || slugify(title, { lower: true, strict: true });

        // Quality & Depth Checks
        const wordCount = countWords(content);
        const readingTime = calculateReadingTime(content);

        if (wordCount < 50) {
            this.logger.error(`Article too short: ${wordCount} words for ${title}`);
            return null;
        }

        // Programmatic SEO Metadata
        const metaTitle = data.metaTitle || title.substring(0, 60);
        const metaDescription = data.metaDescription || (summary.length > 160 ? summary.substring(0, 157) + '...' : summary);

        const article = new this.articleModel({
            ...data,
            title,
            alternativeTitle: data.titleB || data.alternativeTitle,
            slug,
            metaTitle,
            metaDescription,
            wordCount,
            readingTime,
            status: 'published',
            publishedAt: new Date(),
        });

        const saved = await article.save();
        this.logger.log(`Successfully published: ${saved.slug} (${wordCount} words)`);

        return saved;
    }

    async getTopUndistributedArticles(limit = 3) {
        return this.articleModel
            .find({ isDistributed: { $ne: true }, status: 'published' })
            .sort({ performanceScore: -1, trendingScore: -1, publishedAt: -1 })
            .limit(limit)
            .exec();
    }

    async markAsDistributed(id: string) {
        return this.articleModel.findByIdAndUpdate(id, { isDistributed: true }).exec();
    }
}
