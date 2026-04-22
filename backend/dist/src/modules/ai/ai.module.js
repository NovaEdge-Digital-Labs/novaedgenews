"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const article_schema_1 = require("../../schemas/article.schema");
const ai_service_1 = require("./ai.service");
const ai_controller_1 = require("./ai.controller");
const qa_service_1 = require("./qa.service");
const deep_analysis_service_1 = require("./deep-analysis.service");
const headline_testing_service_1 = require("./headline-testing.service");
let AIModule = class AIModule {
};
exports.AIModule = AIModule;
exports.AIModule = AIModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mongoose_1.MongooseModule.forFeature([{ name: article_schema_1.Article.name, schema: article_schema_1.ArticleSchema }]),
        ],
        controllers: [ai_controller_1.AIController],
        providers: [ai_service_1.AIService, qa_service_1.QAService, deep_analysis_service_1.DeepAnalysisService, headline_testing_service_1.HeadlineTestingService],
        exports: [ai_service_1.AIService, qa_service_1.QAService, deep_analysis_service_1.DeepAnalysisService, headline_testing_service_1.HeadlineTestingService],
    })
], AIModule);
//# sourceMappingURL=ai.module.js.map