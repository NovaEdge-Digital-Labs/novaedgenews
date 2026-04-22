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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NewsDiscoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsDiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const article_schema_1 = require("../../schemas/article.schema");
const rxjs_1 = require("rxjs");
const crypto_1 = require("../../utils/crypto");
const slugify_1 = __importDefault(require("slugify"));
let NewsDiscoveryService = NewsDiscoveryService_1 = class NewsDiscoveryService {
    articleModel;
    httpService;
    configService;
    logger = new common_1.Logger(NewsDiscoveryService_1.name);
    queries = ['technology', 'AI', 'startups', 'India tech'];
    constructor(articleModel, httpService, configService) {
        this.articleModel = articleModel;
        this.httpService = httpService;
        this.configService = configService;
    }
    async discoverNews() {
        this.logger.log('Starting news discovery process...');
        const apiKey = this.configService.get('news.apiKey');
        if (!apiKey) {
            this.logger.error('News API key is missing');
            return { total: 0, articles: [] };
        }
        const allArticles = [];
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        for (const query of this.queries) {
            try {
                this.logger.log(`Fetching news for query: ${query}`);
                const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${apiKey}`;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
                const articles = response.data.articles || [];
                this.logger.log(`NewsAPI returned ${articles.length} articles for query: ${query}`);
                let queryProcessedCount = 0;
                for (const item of articles) {
                    if (!item.url || !item.title) {
                        this.logger.debug(`Skipping article with missing URL or title: ${item.title || 'no title'}`);
                        continue;
                    }
                    const publishedAt = new Date(item.publishedAt);
                    if (publishedAt < twentyFourHoursAgo) {
                        this.logger.debug(`Skipping old article: ${item.title} (published at ${item.publishedAt})`);
                        continue;
                    }
                    const existing = await this.articleModel.findOne({ title: item.title });
                    if (existing) {
                        this.logger.debug(`Skipping duplicate title: ${item.title}`);
                        continue;
                    }
                    const rawContent = item.content || item.description || '';
                    const contentHash = (0, crypto_1.calculateHash)(rawContent);
                    const baseSlug = (0, slugify_1.default)(item.title, { lower: true, strict: true });
                    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
                    const categoryMapping = {
                        'technology': 'Technology',
                        'AI': 'AI',
                        'startups': 'Startups',
                        'India tech': 'India Tech'
                    };
                    const articleData = {
                        title: item.title,
                        source: item.source.name,
                        sourceUrl: item.url,
                        publishedAt: publishedAt,
                        image: item.urlToImage,
                        category: categoryMapping[query] || 'General',
                        status: 'pending_extraction',
                        contentHash,
                        slug,
                        summary: item.description || '',
                        content: rawContent,
                        aiMetadata: {
                            rawContent: rawContent,
                        },
                    };
                    const newArticle = new this.articleModel(articleData);
                    await newArticle.save();
                    allArticles.push({
                        title: item.title,
                        source: item.source.name,
                        url: item.url,
                        publishedAt: item.publishedAt,
                        image: item.urlToImage,
                        category: articleData.category,
                        status: 'pending_extraction',
                    });
                    queryProcessedCount++;
                }
                this.logger.log(`Processed ${queryProcessedCount} articles for query: ${query}`);
            }
            catch (error) {
                this.logger.error(`Error discovering news for query "${query}": ${error.message}`);
            }
        }
        this.logger.log(`Discovery complete. Stored ${allArticles.length} new articles.`);
        return {
            articles: allArticles,
            total: allArticles.length,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.NewsDiscoveryService = NewsDiscoveryService;
exports.NewsDiscoveryService = NewsDiscoveryService = NewsDiscoveryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService,
        config_1.ConfigService])
], NewsDiscoveryService);
//# sourceMappingURL=news-discovery.service.js.map