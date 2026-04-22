import { ExtractorService } from './extractor.service';
export declare class ExtractorController {
    private readonly extractorService;
    private readonly logger;
    constructor(extractorService: ExtractorService);
    extract(body: {
        url: string;
        title: string;
    }): Promise<import("./extractor.service").ExtractedContent | {
        status: string;
        rejectionReason: string;
    }>;
}
