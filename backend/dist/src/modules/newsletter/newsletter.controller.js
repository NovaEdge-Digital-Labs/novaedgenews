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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterController = void 0;
const common_1 = require("@nestjs/common");
const newsletter_service_1 = require("./newsletter.service");
const subscribe_dto_1 = require("./dto/subscribe.dto");
let NewsletterController = class NewsletterController {
    newsletterService;
    constructor(newsletterService) {
        this.newsletterService = newsletterService;
    }
    async subscribe(subscribeDto) {
        return await this.newsletterService.subscribe(subscribeDto.email, subscribeDto.preferences);
    }
    async unsubscribe(unsubscribeDto) {
        return await this.newsletterService.unsubscribe(unsubscribeDto.token);
    }
    async unsubscribeViaGet(token) {
        return await this.newsletterService.unsubscribe(token);
    }
    async triggerDailyDigest() {
        return await this.newsletterService.sendDailyDigest();
    }
    async trackOpen(newsletterId, res) {
        if (newsletterId) {
            await this.newsletterService.trackOpen(newsletterId);
        }
        const buffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
        res.set('Content-Type', 'image/gif');
        res.send(buffer);
    }
    async trackClick(newsletterId, redirect, res) {
        if (newsletterId) {
            await this.newsletterService.trackClick(newsletterId);
        }
        return res.redirect(redirect);
    }
};
exports.NewsletterController = NewsletterController;
__decorate([
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscribe_dto_1.SubscribeDto]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Post)('unsubscribe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscribe_dto_1.UnsubscribeDto]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.Get)('unsubscribe'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "unsubscribeViaGet", null);
__decorate([
    (0, common_1.Post)('send-daily-digest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "triggerDailyDigest", null);
__decorate([
    (0, common_1.Get)('track-open'),
    __param(0, (0, common_1.Query)('newsletterId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "trackOpen", null);
__decorate([
    (0, common_1.Get)('track-click'),
    __param(0, (0, common_1.Query)('newsletterId')),
    __param(1, (0, common_1.Query)('redirect')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "trackClick", null);
exports.NewsletterController = NewsletterController = __decorate([
    (0, common_1.Controller)('newsletter'),
    __metadata("design:paramtypes", [newsletter_service_1.NewsletterService])
], NewsletterController);
//# sourceMappingURL=newsletter.controller.js.map