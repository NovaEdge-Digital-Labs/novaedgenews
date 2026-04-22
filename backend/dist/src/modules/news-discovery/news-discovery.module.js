"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsDiscoveryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("@nestjs/axios");
const news_discovery_service_1 = require("./news-discovery.service");
const news_discovery_controller_1 = require("./news-discovery.controller");
const article_schema_1 = require("../../schemas/article.schema");
let NewsDiscoveryModule = class NewsDiscoveryModule {
};
exports.NewsDiscoveryModule = NewsDiscoveryModule;
exports.NewsDiscoveryModule = NewsDiscoveryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: article_schema_1.Article.name, schema: article_schema_1.ArticleSchema }]),
            axios_1.HttpModule,
        ],
        controllers: [news_discovery_controller_1.NewsDiscoveryController],
        providers: [news_discovery_service_1.NewsDiscoveryService],
        exports: [news_discovery_service_1.NewsDiscoveryService],
    })
], NewsDiscoveryModule);
//# sourceMappingURL=news-discovery.module.js.map