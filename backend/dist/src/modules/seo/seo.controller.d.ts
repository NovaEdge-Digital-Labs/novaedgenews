import { SeoService } from './seo.service';
import type { Response } from 'express';
export declare class SeoController {
    private readonly seoService;
    constructor(seoService: SeoService);
    getSitemap(res: Response): Promise<void>;
    triggerSeo(articleId: string): Promise<import("../../schemas/article.schema").ArticleDocument | null>;
}
