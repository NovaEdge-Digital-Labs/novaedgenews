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
var NewsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const article_schema_1 = require("../../schemas/article.schema");
const rxjs_1 = require("rxjs");
const crypto_1 = require("../../utils/crypto");
let NewsService = NewsService_1 = class NewsService {
    articleModel;
    httpService;
    configService;
    logger = new common_1.Logger(NewsService_1.name);
    constructor(articleModel, httpService, configService) {
        this.articleModel = articleModel;
        this.httpService = httpService;
        this.configService = configService;
    }
    async fetchAndProcessNews() {
        this.logger.log('Starting news fetch process...');
        try {
            const apiKey = this.configService.get('news.apiKey');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`https://newsapi.org/v2/top-headlines?language=en&apiKey=${apiKey}`));
            const articles = response.data.articles;
            const newProcessedCount = 0;
            for (const item of articles) {
                const rawContent = item.content || item.description || '';
                const contentHash = (0, crypto_1.calculateHash)(rawContent);
                const exists = await this.articleModel.findOne({
                    $or: [{ sourceUrl: item.url }, { contentHash }]
                });
                if (exists)
                    continue;
                await this.articleModel.create({
                    title: item.title,
                    summary: item.description,
                    content: rawContent,
                    image: item.urlToImage,
                    source: item.source.name,
                    sourceUrl: item.url,
                    publishedAt: new Date(item.publishedAt),
                    status: 'pending_extraction',
                    contentHash,
                });
            }
            this.logger.log(`Discovery complete. Articles are now in pending_extraction status.`);
        }
        catch (error) {
            this.logger.error('Failed to fetch news', error.stack);
            return [];
        }
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = NewsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService,
        config_1.ConfigService])
], NewsService);
//# sourceMappingURL=news.service.js.map