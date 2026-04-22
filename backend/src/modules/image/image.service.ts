import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
    private readonly logger = new Logger(ImageService.name);
    private readonly unsplashAccessKey: string;

    constructor(private readonly configService: ConfigService) {
        this.unsplashAccessKey = this.configService.get<string>('ai.unsplashAccessKey') || '';
    }

    /**
     * Get a high-quality fallback image URL based on keywords
     */
    async getFallbackImage(keywords: string[]): Promise<string> {
        const query = keywords.slice(0, 3).join(',');

        // If we have an API key, we could do a real search
        // For now, we'll use a reliable Unsplash URL pattern
        // This is a placeholder that returns a high-quality image based on the category/keywords
        const randomId = Math.floor(Math.random() * 1000);
        return `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(query)}&sig=${randomId}`;
    }

    /**
     * Validate if an image URL is still accessible
     */
    async validateImageUrl(url: string): Promise<boolean> {
        if (!url) return false;
        try {
            // Minimal check
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}
