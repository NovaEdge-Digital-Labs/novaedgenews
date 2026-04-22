import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { AIService } from './ai.service';

@Injectable()
export class HeadlineTestingService {
    private readonly logger = new Logger(HeadlineTestingService.name);

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        private readonly aiService: AIService,
    ) { }

    /**
     * Generates two headline variants for an article.
     * VARIANT A: Informative/Analytical
     * VARIANT B: Curiosity/Emotional
     */
    async generateVariants(articleId: string): Promise<any> {
        const article = await this.articleModel.findById(articleId);
        if (!article) {
            this.logger.error(`Article not found: ${articleId}`);
            return;
        }

        this.logger.log(`Generating headline variants for article: ${article.title}`);

        const prompt = `
Generate 2 headlines for this article:

VARIANT A - Make it informative and factual:
- Include key insight
- Professional tone
- 8-12 words max

VARIANT B - Make it curiosity-driven:
- Ask question or intrigue reader
- Emotional angle
- 8-12 words max

Article content: ${article.content.slice(0, 2000)}

Return JSON:
{
  "variantA": "headline text",
  "variantB": "headline text",
  "selectedDefault": "A"
}
`;

        try {
            const result = await this.aiService.callAI(this.aiService.primaryClient, prompt, 'google/gemini-flash-1.5');

            await this.articleModel.updateOne(
                { _id: articleId },
                {
                    $set: {
                        headlineA: { text: result.variantA, type: 'informative', keywords: article.tags },
                        headlineB: { text: result.variantB, type: 'curiosity', keywords: article.tags },
                        testingActive: true,
                        testStartDate: new Date(),
                        testEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    }
                }
            );

            this.logger.log(`Variants generated for ${articleId}: A="${result.variantA}", B="${result.variantB}"`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to generate variants for ${articleId}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Evaluates active tests and selects winners for those that have ended.
     */
    async evaluateActiveTests(): Promise<void> {
        const now = new Date();
        const endedTests = await this.articleModel.find({
            testingActive: true,
            testEndDate: { $lte: now }
        }).exec();

        this.logger.log(`Found ${endedTests.length} tests to evaluate.`);

        for (const article of endedTests) {
            const impressionsA = article.impressionsA || 0;
            const impressionsB = article.impressionsB || 0;
            const clicksA = article.clicksA || 0;
            const clicksB = article.clicksB || 0;

            const ctrA = impressionsA > 0 ? clicksA / impressionsA : 0;
            const ctrB = impressionsB > 0 ? clicksB / impressionsB : 0;

            let winner: 'A' | 'B' = 'A';
            if (ctrB > ctrA) {
                winner = 'B';
            } else if (ctrA === ctrB && clicksB > clicksA) {
                winner = 'B'; // Tie-breaker on raw clicks
            }

            const winningHeadline = winner === 'A' ? article.headlineA.text : article.headlineB.text;

            await this.articleModel.updateOne(
                { _id: article._id },
                {
                    $set: {
                        title: winningHeadline,
                        headlineVariant: winner,
                        preferredVariant: winner,
                        testingActive: false,
                        testEndDate: now,
                    }
                }
            );

            this.logger.log(`Test ended for article ${article.slug}. Winner: ${winner} (CTR A: ${ctrA.toFixed(4)}, CTR B: ${ctrB.toFixed(4)})`);
        }
    }
}
