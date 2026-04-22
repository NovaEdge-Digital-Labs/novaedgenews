import { NewsDiscoveryService } from './news-discovery.service';
export declare class NewsDiscoveryController {
    private readonly newsDiscoveryService;
    private readonly logger;
    constructor(newsDiscoveryService: NewsDiscoveryService);
    triggerDiscovery(): Promise<{
        total: number;
        articles: never[];
        timestamp?: undefined;
    } | {
        articles: any[];
        total: number;
        timestamp: string;
    }>;
}
