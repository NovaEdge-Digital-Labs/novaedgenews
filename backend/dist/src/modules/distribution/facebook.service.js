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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FacebookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let FacebookService = FacebookService_1 = class FacebookService {
    configService;
    logger = new common_1.Logger(FacebookService_1.name);
    baseUrl = 'https://novaedge.news';
    constructor(configService) {
        this.configService = configService;
    }
    async sendArticle(article) {
        const pageId = this.configService.get('FACEBOOK_PAGE_ID');
        const accessToken = this.configService.get('FACEBOOK_PAGE_ACCESS_TOKEN');
        if (!pageId || !accessToken) {
            this.logger.warn('Facebook credentials not configured. Skipping push.');
            return;
        }
        const message = `🚀 ${article.title}\n\n${article.summary}\n\nRead more at ${this.baseUrl}/articles/${article.slug}`;
        try {
            await axios_1.default.post(`https://graph.facebook.com/${pageId}/feed`, {
                message,
                link: `${this.baseUrl}/articles/${article.slug}`,
                access_token: accessToken,
            });
            this.logger.log(`Successfully pushed article to Facebook: ${article.slug}`);
        }
        catch (error) {
            this.logger.error(`Failed to push to Facebook: ${error.message}`);
        }
    }
};
exports.FacebookService = FacebookService;
exports.FacebookService = FacebookService = FacebookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FacebookService);
//# sourceMappingURL=facebook.service.js.map