import { Controller, Post, Logger } from '@nestjs/common';
import { NewsDiscoveryService } from './news-discovery.service';

@Controller('news-discovery')
export class NewsDiscoveryController {
    private readonly logger = new Logger(NewsDiscoveryController.name);

    constructor(private readonly newsDiscoveryService: NewsDiscoveryService) { }

    @Post('trigger')
    async triggerDiscovery() {
        this.logger.log('Manual trigger of news discovery received');
        return await this.newsDiscoveryService.discoverNews();
    }
}
