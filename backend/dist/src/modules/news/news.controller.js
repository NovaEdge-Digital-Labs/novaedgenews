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
var NewsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai/ai.service");
const publisher_service_1 = require("../publisher/publisher.service");
let NewsController = NewsController_1 = class NewsController {
    aiService;
    publisherService;
    logger = new common_1.Logger(NewsController_1.name);
    constructor(aiService, publisherService) {
        this.aiService = aiService;
        this.publisherService = publisherService;
    }
    async analyze(body) {
        this.logger.log(`Manual analysis requested for: ${body.title}`);
        try {
            const analysis = await this.aiService.generateAnalysis(body.title, body.content);
            const saved = await this.publisherService.publish({
                ...analysis,
                isEditorial: true,
                isEditorPick: true
            });
            return {
                message: 'Editorial analysis generated and published successfully',
                article: saved
            };
        }
        catch (error) {
            this.logger.error(`Failed to generate analysis: ${error.message}`);
            return {
                error: 'Failed to generate analysis',
                details: error.message
            };
        }
    }
};
exports.NewsController = NewsController;
__decorate([
    (0, common_1.Post)('analyze'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "analyze", null);
exports.NewsController = NewsController = NewsController_1 = __decorate([
    (0, common_1.Controller)('api/news'),
    __metadata("design:paramtypes", [ai_service_1.AIService,
        publisher_service_1.PublisherService])
], NewsController);
//# sourceMappingURL=news.controller.js.map