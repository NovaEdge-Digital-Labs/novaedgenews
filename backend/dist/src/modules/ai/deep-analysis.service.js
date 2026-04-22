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
var DeepAnalysisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
let DeepAnalysisService = DeepAnalysisService_1 = class DeepAnalysisService {
    aiService;
    logger = new common_1.Logger(DeepAnalysisService_1.name);
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generate(quickNews, originalContent) {
        this.logger.log(`Generating Deep Analysis for article...`);
        const prompt = `Write a deep analysis article (700-900 words) with sections: Context, Breakdown, Analysis, Conclusion. 
Use this quick news as base: [${quickNews}]
And this original content for details: [${originalContent}]

Rules:
- Human-like, professional tone
- Include specific facts, numbers, quotes
- No AI preamble or meta-text
- Structure with clear headers
- Active voice
- Max 25 words per sentence
- NO AI meta-text ("this article", "as an AI", etc.)
- Human voice throughout
- Max paragraph length: 150 words
- Include 2-3 relevant quotes
- Reference sources naturally
- Add section headers:
  1. HEADLINE SECTION (approx. 50 words)
  2. Why This Matters (approx. 150 words)
  3. Here's What Happened (approx. 300 words)
  4. What It Means (approx. 200 words)
  5. What's Next (approx. 100 words)

Return ONLY the article text, no JSON.`;
        try {
            const content = await this.aiService.callAI(this.aiService.primaryClient, prompt, 'google/gemini-pro');
            if (!content || typeof content !== 'string') {
                throw new Error('Invalid AI response format');
            }
            const wordCount = content.split(/\s+/).length;
            const readingTimeMinutes = Math.ceil(wordCount / 200);
            return {
                content,
                wordCount,
                readingTimeMinutes,
                generatedAt: new Date(),
                status: 'generated'
            };
        }
        catch (error) {
            this.logger.error(`Deep Analysis generation failed: ${error.message}`);
            try {
                this.logger.log(`Attempting fallback generation...`);
                const content = await this.aiService.callAI(this.aiService.fallbackClient, prompt, 'gemini-1.5-flash-latest');
                const wordCount = content.split(/\s+/).length;
                const readingTimeMinutes = Math.ceil(wordCount / 200);
                return {
                    content,
                    wordCount,
                    readingTimeMinutes,
                    generatedAt: new Date(),
                    status: 'generated'
                };
            }
            catch (fallbackError) {
                this.logger.error(`Deep Analysis generation failed (fallback): ${fallbackError.message}`);
                return {
                    status: 'failed',
                    generatedAt: new Date()
                };
            }
        }
    }
};
exports.DeepAnalysisService = DeepAnalysisService;
exports.DeepAnalysisService = DeepAnalysisService = DeepAnalysisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AIService])
], DeepAnalysisService);
//# sourceMappingURL=deep-analysis.service.js.map