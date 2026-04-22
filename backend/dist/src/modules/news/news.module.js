"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("@nestjs/axios");
const news_service_1 = require("./news.service");
const news_controller_1 = require("./news.controller");
const article_schema_1 = require("../../schemas/article.schema");
const ai_module_1 = require("../ai/ai.module");
const publisher_module_1 = require("../publisher/publisher.module");
let NewsModule = class NewsModule {
};
exports.NewsModule = NewsModule;
exports.NewsModule = NewsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: article_schema_1.Article.name, schema: article_schema_1.ArticleSchema }]),
            axios_1.HttpModule,
            ai_module_1.AIModule,
            publisher_module_1.PublisherModule,
        ],
        controllers: [news_controller_1.NewsController],
        providers: [news_service_1.NewsService],
        exports: [news_service_1.NewsService],
    })
], NewsModule);
//# sourceMappingURL=news.module.js.map