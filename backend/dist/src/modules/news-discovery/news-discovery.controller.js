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
var NewsDiscoveryController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsDiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const news_discovery_service_1 = require("./news-discovery.service");
let NewsDiscoveryController = NewsDiscoveryController_1 = class NewsDiscoveryController {
    newsDiscoveryService;
    logger = new common_1.Logger(NewsDiscoveryController_1.name);
    constructor(newsDiscoveryService) {
        this.newsDiscoveryService = newsDiscoveryService;
    }
    async triggerDiscovery() {
        this.logger.log('Manual trigger of news discovery received');
        return await this.newsDiscoveryService.discoverNews();
    }
};
exports.NewsDiscoveryController = NewsDiscoveryController;
__decorate([
    (0, common_1.Post)('trigger'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsDiscoveryController.prototype, "triggerDiscovery", null);
exports.NewsDiscoveryController = NewsDiscoveryController = NewsDiscoveryController_1 = __decorate([
    (0, common_1.Controller)('news-discovery'),
    __metadata("design:paramtypes", [news_discovery_service_1.NewsDiscoveryService])
], NewsDiscoveryController);
//# sourceMappingURL=news-discovery.controller.js.map