import { Controller, Post, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('api/analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Post('impression')
    async trackImpression(@Body() data: { articleId: string, variant?: 'A' | 'B' }) {
        return this.analyticsService.trackImpression(data.articleId, data.variant);
    }

    @Post('click')
    async trackClick(@Body() data: { articleId: string, variant?: 'A' | 'B' }) {
        return this.analyticsService.trackClick(data.articleId, data.variant);
    }

    @Post('view')
    async trackView(@Body() data: { articleId: string }) {
        return this.analyticsService.trackView(data.articleId);
    }
}
