import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AIService } from './ai.service';
import { QAService } from './qa.service';

@Controller('ai')
export class AIController {
    private readonly logger = new Logger(AIController.name);

    constructor(
        private readonly aiService: AIService,
        private readonly qaService: QAService
    ) { }

    @Post('rewrite-quick')
    async rewriteQuick(@Body() body: { title: string; content: string }) {
        if (!body.title || !body.content) {
            return { status: 'rejected', rejectionReason: 'Missing title or content' };
        }
        return await this.aiService.rewriteAsQuickNews(body.title, body.content);
    }

    @Post('deep-analysis')
    async deepAnalysis(@Body() body: { quickSummary: string; originalContent: string }) {
        if (!body.quickSummary || !body.originalContent) {
            return { status: 'rejected', rejectionReason: 'Missing quickSummary or originalContent' };
        }
        return await this.aiService.generateDeepAnalysis(body.quickSummary, body.originalContent);
    }

    @Post('verify')
    async verify(@Body() body: { article: any; sourceArticle: any }) {
        if (!body.article || !body.sourceArticle) {
            return { status: 'rejected', rejectionReason: 'Missing article or sourceArticle' };
        }
        return await this.qaService.validateArticle(body.article, body.sourceArticle);
    }
}
