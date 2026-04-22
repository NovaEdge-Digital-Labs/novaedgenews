import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';

@Injectable()
export class OptimizationService {
    private readonly logger = new Logger(OptimizationService.name);

    constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) { }

    /**
     * Runs headline A/B testing optimization.
     * Selects winner based on CTR after minimum impressions.
     */
    async optimizeHeadlines() {
        this.logger.log('Starting headline optimization task...');

        // Find articles with variants but no winner selected yet
        const articles = await this.articleModel.find({
            status: 'published',
            $or: [
                { testingActive: true },
                { preferredVariant: null, alternativeTitle: { $exists: true, $ne: '' } }
            ]
        }).exec();

        this.logger.log(`Found ${articles.length} articles for potential optimization.`);

        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const now = new Date();

        for (const article of articles) {
            const testStartDate = article.testStartDate || article.publishedAt;
            const diff = now.getTime() - testStartDate.getTime();

            const minImpressions = 50;
            const impressionsA = article.impressionsA || 0;
            const impressionsB = article.impressionsB || 0;

            // Condition 1: 7 days have passed
            // Condition 2: Enough data (500+ impressions total if not 7 days yet)
            if (diff >= sevenDaysMs || (impressionsA + impressionsB >= 500)) {
                const ctrA = impressionsA > 0 ? (article.clicksA / impressionsA) : 0;
                const ctrB = impressionsB > 0 ? (article.clicksB / impressionsB) : 0;

                // Also consider bounce rate if available
                const bounceRateA = article.impressionsA > 0 ? (article.bounceCountA || 0) / article.impressionsA : 1;
                const bounceRateB = article.impressionsB > 0 ? (article.bounceCountB || 0) / article.impressionsB : 1;

                // Composite score (CTR + bonus for low bounce rate)
                const scoreA = ctrA * (1 - bounceRateA);
                const scoreB = ctrB * (1 - bounceRateB);

                const winner = scoreA >= scoreB ? 'A' : 'B';

                this.logger.log(`A/B Test Winner for "${article.slug}": Variant ${winner} (Score A: ${scoreA.toFixed(4)}, Score B: ${scoreB.toFixed(4)})`);

                await this.articleModel.updateOne(
                    { _id: article._id },
                    {
                        $set: {
                            preferredVariant: winner,
                            testingActive: false,
                            title: winner === 'A' ? (article.headlineA?.text || article.title) : (article.headlineB?.text || article.alternativeTitle || article.title)
                        }
                    }
                );
            }
        }
    }
}
