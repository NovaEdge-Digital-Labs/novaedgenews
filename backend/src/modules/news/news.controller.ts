import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { PublisherService } from '../publisher/publisher.service';

@Controller('api/news')
export class NewsController {
    private readonly logger = new Logger(NewsController.name);

    constructor(
        private readonly aiService: AIService,
        private readonly publisherService: PublisherService,
    ) { }

    @Post('analyze')
    async analyze(@Body() body: { title: string; content: string }) {
        this.logger.log(`Manual analysis requested for: ${body.title}`);

        try {
            const analysis = await this.aiService.generateAnalysis(body.title, body.content);
            const saved = await this.publisherService.publish({
                ...analysis,
                isEditorial: true,
                isEditorPick: true
            });

            return {
                message: 'Editorial analysis generated and published successfully',
                article: saved
            };
        } catch (error) {
            this.logger.error(`Failed to generate analysis: ${error.message}`);
            return {
                error: 'Failed to generate analysis',
                details: error.message
            };
        }
    }
}
