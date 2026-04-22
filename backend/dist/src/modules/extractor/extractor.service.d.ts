import { HttpService } from '@nestjs/axios';
export interface ExtractedContent {
    url: string;
    title: string;
    content?: string;
    author?: string | null;
    publishedDate?: string | null;
    mainImage?: string | null;
    wordCount?: number;
    category?: string | null;
    status: string;
    rejectionReason?: string | null;
}
export declare class ExtractorService {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    extractContent(url: string, title: string): Promise<ExtractedContent>;
    private extractWithTimeout;
    private extractContent_Internal;
    private parseHTML;
    private parseHTMLFallback;
    private detectPaywall;
    private logExtractionError;
    private isRetryable;
    private timeoutPromise;
    private delay;
}
