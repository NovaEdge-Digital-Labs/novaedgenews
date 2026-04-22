import { ConfigService } from '@nestjs/config';
export declare class ImageService {
    private readonly configService;
    private readonly logger;
    private readonly unsplashAccessKey;
    constructor(configService: ConfigService);
    getFallbackImage(keywords: string[]): Promise<string>;
    validateImageUrl(url: string): Promise<boolean>;
}
