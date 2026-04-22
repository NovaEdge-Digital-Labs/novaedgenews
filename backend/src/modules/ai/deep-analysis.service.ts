import { Injectable, Logger } from '@nestjs/common';
import { AIService } from './ai.service';

@Injectable()
export class DeepAnalysisService {
    private readonly logger = new Logger(DeepAnalysisService.name);

    constructor(private readonly aiService: AIService) { }

    async generate(quickNews: string, originalContent: string): Promise<any> {
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
        } catch (error) {
            this.logger.error(`Deep Analysis generation failed: ${error.message}`);

            // Fallback attempt
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
            } catch (fallbackError) {
                this.logger.error(`Deep Analysis generation failed (fallback): ${fallbackError.message}`);
                return {
                    status: 'failed',
                    generatedAt: new Date()
                };
            }
        }
    }
}
