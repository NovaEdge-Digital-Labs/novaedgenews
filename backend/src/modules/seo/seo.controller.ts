import { Controller, Get, Post, Res, Header, Param } from '@nestjs/common';
import { SeoService } from './seo.service';
import type { Response } from 'express';

@Controller('api/seo')
export class SeoController {
    constructor(private readonly seoService: SeoService) { }

    @Get('sitemap.xml')
    @Header('Content-Type', 'application/xml')
    async getSitemap(@Res() res: Response) {
        const sitemap = await this.seoService.generateSitemap();
        res.send(sitemap);
    }

    @Get('health')
    async getHealthStatus() {
        return this.seoService.getSystemHealthStatus();
    }

    @Post('regenerate')
    async regenerateAll() {
        return this.seoService.regenerateAllSEO();
    }

    @Get('generate/:id')
    async triggerSeo(@Param('id') articleId: string) {
        return this.seoService.generateSeoMetadata(articleId);
    }
}
