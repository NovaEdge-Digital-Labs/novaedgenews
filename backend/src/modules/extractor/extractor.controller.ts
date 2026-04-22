import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ExtractorService } from './extractor.service';

@Controller('extractor')
export class ExtractorController {
    private readonly logger = new Logger(ExtractorController.name);

    constructor(private readonly extractorService: ExtractorService) { }

    @Post('extract')
    async extract(@Body() body: { url: string; title: string }) {
        if (!body.url || !body.title) {
            return { status: 'rejected', rejectionReason: 'Missing URL or title' };
        }
        return await this.extractorService.extractContent(body.url, body.title);
    }
}
