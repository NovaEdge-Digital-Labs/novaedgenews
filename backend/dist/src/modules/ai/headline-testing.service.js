"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var HeadlineTestingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadlineTestingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("../../schemas/article.schema");
const ai_service_1 = require("./ai.service");
let HeadlineTestingService = HeadlineTestingService_1 = class HeadlineTestingService {
    articleModel;
    aiService;
    logger = new common_1.Logger(HeadlineTestingService_1.name);
    constructor(articleModel, aiService) {
        this.articleModel = articleModel;
        this.aiService = aiService;
    }
    async generateVariants(articleId) {
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
            await this.articleModel.updateOne({ _id: articleId }, {
                $set: {
                    headlineA: { text: result.variantA, type: 'informative', keywords: article.tags },
                    headlineB: { text: result.variantB, type: 'curiosity', keywords: article.tags },
                    testingActive: true,
                    testStartDate: new Date(),
                    testEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                }
            });
            this.logger.log(`Variants generated for ${articleId}: A="${result.variantA}", B="${result.variantB}"`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to generate variants for ${articleId}: ${error.message}`);
            throw error;
        }
    }
    async evaluateActiveTests() {
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
            let winner = 'A';
            if (ctrB > ctrA) {
                winner = 'B';
            }
            else if (ctrA === ctrB && clicksB > clicksA) {
                winner = 'B';
            }
            const winningHeadline = winner === 'A' ? article.headlineA.text : article.headlineB.text;
            await this.articleModel.updateOne({ _id: article._id }, {
                $set: {
                    title: winningHeadline,
                    headlineVariant: winner,
                    preferredVariant: winner,
                    testingActive: false,
                    testEndDate: now,
                }
            });
            this.logger.log(`Test ended for article ${article.slug}. Winner: ${winner} (CTR A: ${ctrA.toFixed(4)}, CTR B: ${ctrB.toFixed(4)})`);
        }
    }
};
exports.HeadlineTestingService = HeadlineTestingService;
exports.HeadlineTestingService = HeadlineTestingService = HeadlineTestingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        ai_service_1.AIService])
], HeadlineTestingService);
//# sourceMappingURL=headline-testing.service.js.map