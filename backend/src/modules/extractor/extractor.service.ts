import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { chromium } from 'playwright';
import { load } from 'cheerio';
import { countWords, normalizeWhitespace, isGibberish } from '../../utils/text';

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

@Injectable()
export class ExtractorService {
    private readonly logger = new Logger(ExtractorService.name);

    constructor(private readonly httpService: HttpService) { }

    async extractContent(url: string, title: string): Promise<ExtractedContent> {
        this.logger.log(`Starting Playwright content extraction for: ${url}`);
        const maxRetries = 3;
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.extractWithTimeout(url, title, 30000); // 30s timeout
            } catch (error: any) {
                lastError = error;
                this.logger.warn(`Extraction attempt ${attempt} failed for ${url}`, error.message);

                if (attempt < maxRetries) {
                    await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
                }
            }
        }

        this.logExtractionError(url, lastError || new Error('Unknown error'), 'rejected');

        return {
            url,
            title,
            status: 'rejected',
            rejectionReason: `Extraction failed after ${maxRetries} attempts: ${lastError?.message}`
        };
    }

    private async extractWithTimeout(
        url: string,
        title: string,
        timeoutMs: number
    ): Promise<ExtractedContent> {
        return Promise.race([
            this.extractContent_Internal(url, title),
            this.timeoutPromise(timeoutMs)
        ]);
    }

    private async extractContent_Internal(url: string, title: string): Promise<ExtractedContent> {
        const browser = await chromium.launch({ headless: true });

        try {
            const context = await browser.newContext();
            const page = await context.newPage();

            // Block unnecessary resources to speed up extraction
            await page.route('**/*.{png,jpg,jpeg,gif,svg,webp,mp4,mov}', route => route.abort());

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

            // Wait for main content heuristic
            try {
                await page.waitForSelector('article, [role="main"], main, .article-content', {
                    timeout: 5000
                }).catch(() => { });
            } catch (e) {
                // Continue anyway
            }

            const html = await page.content();

            if (this.detectPaywall(html)) {
                return {
                    url,
                    title,
                    status: 'rejected',
                    rejectionReason: 'Paywall detected'
                };
            }

            const extracted = this.parseHTML(html, url, title);

            // Validate extraction
            if ((extracted.wordCount || 0) < 300) {
                // Fallback: try simpler method
                const fallback = await this.parseHTMLFallback(html, url, title);
                if ((fallback.wordCount || 0) >= 300) {
                    return fallback;
                }
                return {
                    url,
                    title,
                    status: 'rejected',
                    rejectionReason: 'Content too short after extraction'
                };
            }

            if (extracted.content && isGibberish(extracted.content)) {
                return {
                    ...extracted,
                    status: 'rejected',
                    rejectionReason: 'Possible gibberish or non-English content'
                };
            }

            this.logger.log(`Extraction complete for ${url}. Status: ${extracted.status}`);
            return extracted;
        } finally {
            await browser.close();
        }
    }

    private parseHTML(html: string, url: string, providedTitle: string): ExtractedContent {
        const $ = load(html);

        // Remove junk
        $('script, style, noscript, nav, footer, aside, iframe, [role="complementary"]').remove();
        $('[class*="ad"], [id*="ad"], .advertisement, .related, .sidebar, .comments, .social-share').remove();

        // Extract metadata
        const author =
            $('meta[name="author"]').attr('content') ||
            $('meta[property="article:author"]').attr('content') ||
            $('[rel="author"], .author-name, [itemprop="author"], [class*="author"], [id*="author"]').first().text().trim() ||
            null;

        const publishedDate =
            $('meta[property="article:published_time"]').attr('content') ||
            $('meta[name="publish-date"]').attr('content') ||
            $('time, [itemprop="datePublished"]').first().attr('datetime') ||
            null;

        const mainImage =
            $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('article img, [role="main"] img, img[alt*="featured"]').first().attr('src') ||
            null;

        const category =
            $('meta[property="article:section"]').attr('content') ||
            $('meta[name="category"]').attr('content') ||
            null;

        const pageTitle = $('h1').first().text() || $('title').text() || providedTitle;

        // Extract main content
        const article: any = $('article')?.length > 0
            ? $('article').first()
            : $('[role="main"]').first().length > 0 ? $('[role="main"]').first() : $('main').first().length > 0 ? $('main').first() : $.root();

        const paragraphs: string[] = [];
        article.find('p').each((_, el) => {
            const text = normalizeWhitespace($(el).text());
            if (text.length > 50 && !paragraphs.includes(text)) {
                const lowerText = text.toLowerCase();
                const noiseKeywords = [
                    'follow us on', 'read more:', 'copyright', 'signing up', 'junk folder',
                    'subscribe', 'newsletter', 'privacy policy', 'terms of service',
                    'all rights reserved', 'visit our community guidelines', 'consent to receive'
                ];
                if (!noiseKeywords.some(kw => lowerText.includes(kw))) {
                    paragraphs.push(text);
                }
            }
        });

        const content = paragraphs.join('\n\n');
        const wordCount = countWords(content);

        return {
            url,
            title: pageTitle,
            status: wordCount >= 300 ? 'success' : 'rejected',
            rejectionReason: wordCount < 300 ? `Only ${wordCount} words extracted` : null,
            content,
            author,
            mainImage,
            publishedDate,
            category,
            wordCount
        };
    }

    private parseHTMLFallback(html: string, url: string, providedTitle: string): ExtractedContent {
        const $ = load(html);
        $('script, style, noscript, nav, footer, header, aside').remove();

        let text = normalizeWhitespace($.text().trim());
        const sentences: string[] = text.match(/[^.!?]+[.!?]+/g) || [];
        // Attempt a more generous collection, filtering exceptionally short or non-standard sentences.
        const validSentences = sentences.filter(s => s.trim().length > 20);
        const content = validSentences.slice(0, 50).join('\n\n');

        const wordCount = countWords(content);

        return {
            url,
            title: providedTitle,
            status: 'success',
            content,
            wordCount
        };
    }

    private detectPaywall(html: string): boolean {
        const paywallPatterns = [
            /subscribe to read|subscription required/i,
            /please sign in|create an account to continue/i,
            /limited articles|views remaining/i,
            /paywall|metered paywall/i,
            /member-only|subscribers only/i,
            /exclusive for subscribers/i,
            /support independent journalism/i
        ];

        return paywallPatterns.some(pattern => pattern.test(html));
    }

    private logExtractionError(url: string, error: Error, status: string) {
        // Fallback to internal logger instead of direct DB since model is not injected
        this.logger.error(`[Extraction Error Tracking] URL: ${url} | Status: ${status} | Retryable: ${this.isRetryable(error)} | Message: ${error.message}`);
    }

    private isRetryable(error: Error): boolean {
        const retryableErrors = ['timeout', 'network', 'ECONNREFUSED', 'ETIMEDOUT', 'browser has been closed'];
        return retryableErrors.some(msg => error.message.toLowerCase().includes(msg.toLowerCase()));
    }

    private timeoutPromise(ms: number): Promise<never> {
        return new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Extraction timeout')), ms)
        );
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
