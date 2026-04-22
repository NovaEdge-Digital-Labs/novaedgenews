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
var TwitterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TwitterService = TwitterService_1 = class TwitterService {
    configService;
    logger = new common_1.Logger(TwitterService_1.name);
    baseUrl = 'https://novaedge.news';
    constructor(configService) {
        this.configService = configService;
    }
    async sendArticle(article) {
        const apiKey = this.configService.get('TWITTER_API_KEY');
        const accessToken = this.configService.get('TWITTER_ACCESS_TOKEN');
        if (!apiKey || !accessToken) {
            this.logger.warn('Twitter credentials not configured. Skipping push.');
            return;
        }
        const tweetText = `🚀 ${article.title}\n\n${article.summary.substring(0, 150)}...\n\nRead more: ${this.baseUrl}/articles/${article.slug}`;
        try {
            this.logger.log(`Simulated Twitter push for: ${article.slug}`);
        }
        catch (error) {
            this.logger.error(`Failed to push to Twitter: ${error.message}`);
        }
    }
};
exports.TwitterService = TwitterService;
exports.TwitterService = TwitterService = TwitterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TwitterService);
//# sourceMappingURL=twitter.service.js.map