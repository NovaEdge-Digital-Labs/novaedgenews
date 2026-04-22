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
var ImageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ImageService = ImageService_1 = class ImageService {
    configService;
    logger = new common_1.Logger(ImageService_1.name);
    unsplashAccessKey;
    constructor(configService) {
        this.configService = configService;
        this.unsplashAccessKey = this.configService.get('ai.unsplashAccessKey') || '';
    }
    async getFallbackImage(keywords) {
        const query = keywords.slice(0, 3).join(',');
        const randomId = Math.floor(Math.random() * 1000);
        return `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(query)}&sig=${randomId}`;
    }
    async validateImageUrl(url) {
        if (!url)
            return false;
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        }
        catch (error) {
            return false;
        }
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = ImageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ImageService);
//# sourceMappingURL=image.service.js.map