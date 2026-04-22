import { ConfigService } from '@nestjs/config';
export declare class FacebookService {
    private readonly configService;
    private readonly logger;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    sendArticle(article: any): Promise<void>;
}
