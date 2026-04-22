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
var AIController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const qa_service_1 = require("./qa.service");
let AIController = AIController_1 = class AIController {
    aiService;
    qaService;
    logger = new common_1.Logger(AIController_1.name);
    constructor(aiService, qaService) {
        this.aiService = aiService;
        this.qaService = qaService;
    }
    async rewriteQuick(body) {
        if (!body.title || !body.content) {
            return { status: 'rejected', rejectionReason: 'Missing title or content' };
        }
        return await this.aiService.rewriteAsQuickNews(body.title, body.content);
    }
    async deepAnalysis(body) {
        if (!body.quickSummary || !body.originalContent) {
            return { status: 'rejected', rejectionReason: 'Missing quickSummary or originalContent' };
        }
        return await this.aiService.generateDeepAnalysis(body.quickSummary, body.originalContent);
    }
    async verify(body) {
        if (!body.article || !body.sourceArticle) {
            return { status: 'rejected', rejectionReason: 'Missing article or sourceArticle' };
        }
        return await this.qaService.validateArticle(body.article, body.sourceArticle);
    }
};
exports.AIController = AIController;
__decorate([
    (0, common_1.Post)('rewrite-quick'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "rewriteQuick", null);
__decorate([
    (0, common_1.Post)('deep-analysis'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "deepAnalysis", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "verify", null);
exports.AIController = AIController = AIController_1 = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AIService,
        qa_service_1.QAService])
], AIController);
//# sourceMappingURL=ai.controller.js.map