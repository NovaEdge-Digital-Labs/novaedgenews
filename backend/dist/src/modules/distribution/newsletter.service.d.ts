export declare class NewsletterService {
    private readonly logger;
    sendArticle(article: any): Promise<{
        platform: string;
        success: boolean;
        timestamp: string;
    }>;
}
