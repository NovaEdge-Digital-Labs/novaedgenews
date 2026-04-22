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
var PublisherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("../../schemas/article.schema");
const slugify_1 = __importDefault(require("slugify"));
const text_1 = require("../../utils/text");
let PublisherService = PublisherService_1 = class PublisherService {
    articleModel;
    logger = new common_1.Logger(PublisherService_1.name);
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async publish(data) {
        const title = data.title || data.titleA;
        const summary = data.summary;
        const content = data.content;
        if (!title || !content || !summary) {
            this.logger.error(`Missing core fields for article: ${title || 'unknown'}`);
            return null;
        }
        this.logger.log(`Publishing article: ${title}`);
        const slug = data.slug || (0, slugify_1.default)(title, { lower: true, strict: true });
        const wordCount = (0, text_1.countWords)(content);
        const readingTime = (0, text_1.calculateReadingTime)(content);
        if (wordCount < 50) {
            this.logger.error(`Article too short: ${wordCount} words for ${title}`);
            return null;
        }
        const metaTitle = data.metaTitle || title.substring(0, 60);
        const metaDescription = data.metaDescription || (summary.length > 160 ? summary.substring(0, 157) + '...' : summary);
        const article = new this.articleModel({
            ...data,
            title,
            alternativeTitle: data.titleB || data.alternativeTitle,
            slug,
            metaTitle,
            metaDescription,
            wordCount,
            readingTime,
            status: 'published',
            publishedAt: new Date(),
        });
        const saved = await article.save();
        this.logger.log(`Successfully published: ${saved.slug} (${wordCount} words)`);
        return saved;
    }
    async getTopUndistributedArticles(limit = 3) {
        return this.articleModel
            .find({ isDistributed: { $ne: true }, status: 'published' })
            .sort({ performanceScore: -1, trendingScore: -1, publishedAt: -1 })
            .limit(limit)
            .exec();
    }
    async markAsDistributed(id) {
        return this.articleModel.findByIdAndUpdate(id, { isDistributed: true }).exec();
    }
};
exports.PublisherService = PublisherService;
exports.PublisherService = PublisherService = PublisherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PublisherService);
//# sourceMappingURL=publisher.service.js.map