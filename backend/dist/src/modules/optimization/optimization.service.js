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
var OptimizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("../../schemas/article.schema");
let OptimizationService = OptimizationService_1 = class OptimizationService {
    articleModel;
    logger = new common_1.Logger(OptimizationService_1.name);
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async optimizeHeadlines() {
        this.logger.log('Starting headline optimization task...');
        const articles = await this.articleModel.find({
            status: 'published',
            $or: [
                { testingActive: true },
                { preferredVariant: null, alternativeTitle: { $exists: true, $ne: '' } }
            ]
        }).exec();
        this.logger.log(`Found ${articles.length} articles for potential optimization.`);
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const now = new Date();
        for (const article of articles) {
            const testStartDate = article.testStartDate || article.publishedAt;
            const diff = now.getTime() - testStartDate.getTime();
            const minImpressions = 50;
            const impressionsA = article.impressionsA || 0;
            const impressionsB = article.impressionsB || 0;
            if (diff >= sevenDaysMs || (impressionsA + impressionsB >= 500)) {
                const ctrA = impressionsA > 0 ? (article.clicksA / impressionsA) : 0;
                const ctrB = impressionsB > 0 ? (article.clicksB / impressionsB) : 0;
                const bounceRateA = article.impressionsA > 0 ? (article.bounceCountA || 0) / article.impressionsA : 1;
                const bounceRateB = article.impressionsB > 0 ? (article.bounceCountB || 0) / article.impressionsB : 1;
                const scoreA = ctrA * (1 - bounceRateA);
                const scoreB = ctrB * (1 - bounceRateB);
                const winner = scoreA >= scoreB ? 'A' : 'B';
                this.logger.log(`A/B Test Winner for "${article.slug}": Variant ${winner} (Score A: ${scoreA.toFixed(4)}, Score B: ${scoreB.toFixed(4)})`);
                await this.articleModel.updateOne({ _id: article._id }, {
                    $set: {
                        preferredVariant: winner,
                        testingActive: false,
                        title: winner === 'A' ? (article.headlineA?.text || article.title) : (article.headlineB?.text || article.alternativeTitle || article.title)
                    }
                });
            }
        }
    }
};
exports.OptimizationService = OptimizationService;
exports.OptimizationService = OptimizationService = OptimizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OptimizationService);
//# sourceMappingURL=optimization.service.js.map