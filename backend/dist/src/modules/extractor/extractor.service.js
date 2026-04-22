"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ExtractorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractorService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const playwright_1 = require("playwright");
const cheerio_1 = require("cheerio");
const text_1 = require("../../utils/text");
let ExtractorService = ExtractorService_1 = class ExtractorService {
    httpService;
    logger = new common_1.Logger(ExtractorService_1.name);
    constructor(httpService) {
        this.httpService = httpService;
    }
    async extractContent(url, title) {
        this.logger.log(`Starting Playwright content extraction for: ${url}`);
        const maxRetries = 3;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.extractWithTimeout(url, title, 30000);
            }
            catch (error) {
                lastError = error;
                this.logger.warn(`Extraction attempt ${attempt} failed for ${url}`, error.message);
                if (attempt < maxRetries) {
                    await this.delay(Math.pow(2, attempt) * 1000);
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
    async extractWithTimeout(url, title, timeoutMs) {
        return Promise.race([
            this.extractContent_Internal(url, title),
            this.timeoutPromise(timeoutMs)
        ]);
    }
    async extractContent_Internal(url, title) {
        const browser = await playwright_1.chromium.launch({ headless: true });
        try {
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.route('**/*.{png,jpg,jpeg,gif,svg,webp,mp4,mov}', route => route.abort());
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
            try {
                await page.waitForSelector('article, [role="main"], main, .article-content', {
                    timeout: 5000
                }).catch(() => { });
            }
            catch (e) {
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
            if ((extracted.wordCount || 0) < 300) {
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
            if (extracted.content && (0, text_1.isGibberish)(extracted.content)) {
                return {
                    ...extracted,
                    status: 'rejected',
                    rejectionReason: 'Possible gibberish or non-English content'
                };
            }
            this.logger.log(`Extraction complete for ${url}. Status: ${extracted.status}`);
            return extracted;
        }
        finally {
            await browser.close();
        }
    }
    parseHTML(html, url, providedTitle) {
        const $ = (0, cheerio_1.load)(html);
        $('script, style, noscript, nav, footer, aside, iframe, [role="complementary"]').remove();
        $('[class*="ad"], [id*="ad"], .advertisement, .related, .sidebar, .comments, .social-share').remove();
        const author = $('meta[name="author"]').attr('content') ||
            $('meta[property="article:author"]').attr('content') ||
            $('[rel="author"], .author-name, [itemprop="author"], [class*="author"], [id*="author"]').first().text().trim() ||
            null;
        const publishedDate = $('meta[property="article:published_time"]').attr('content') ||
            $('meta[name="publish-date"]').attr('content') ||
            $('time, [itemprop="datePublished"]').first().attr('datetime') ||
            null;
        const mainImage = $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('article img, [role="main"] img, img[alt*="featured"]').first().attr('src') ||
            null;
        const category = $('meta[property="article:section"]').attr('content') ||
            $('meta[name="category"]').attr('content') ||
            null;
        const pageTitle = $('h1').first().text() || $('title').text() || providedTitle;
        const article = $('article')?.length > 0
            ? $('article').first()
            : $('[role="main"]').first().length > 0 ? $('[role="main"]').first() : $('main').first().length > 0 ? $('main').first() : $.root();
        const paragraphs = [];
        article.find('p').each((_, el) => {
            const text = (0, text_1.normalizeWhitespace)($(el).text());
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
        const wordCount = (0, text_1.countWords)(content);
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
    parseHTMLFallback(html, url, providedTitle) {
        const $ = (0, cheerio_1.load)(html);
        $('script, style, noscript, nav, footer, header, aside').remove();
        let text = (0, text_1.normalizeWhitespace)($.text().trim());
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const validSentences = sentences.filter(s => s.trim().length > 20);
        const content = validSentences.slice(0, 50).join('\n\n');
        const wordCount = (0, text_1.countWords)(content);
        return {
            url,
            title: providedTitle,
            status: 'success',
            content,
            wordCount
        };
    }
    detectPaywall(html) {
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
    logExtractionError(url, error, status) {
        this.logger.error(`[Extraction Error Tracking] URL: ${url} | Status: ${status} | Retryable: ${this.isRetryable(error)} | Message: ${error.message}`);
    }
    isRetryable(error) {
        const retryableErrors = ['timeout', 'network', 'ECONNREFUSED', 'ETIMEDOUT', 'browser has been closed'];
        return retryableErrors.some(msg => error.message.toLowerCase().includes(msg.toLowerCase()));
    }
    timeoutPromise(ms) {
        return new Promise((_, reject) => setTimeout(() => reject(new Error('Extraction timeout')), ms));
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.ExtractorService = ExtractorService;
exports.ExtractorService = ExtractorService = ExtractorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ExtractorService);
//# sourceMappingURL=extractor.service.js.map