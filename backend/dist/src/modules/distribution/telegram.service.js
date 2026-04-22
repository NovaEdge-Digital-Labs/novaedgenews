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
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let TelegramService = TelegramService_1 = class TelegramService {
    configService;
    scheduleQueue;
    logger = new common_1.Logger(TelegramService_1.name);
    baseUrl = 'https://novaedge.news';
    constructor(configService, scheduleQueue) {
        this.configService = configService;
        this.scheduleQueue = scheduleQueue;
    }
    async distributeArticle(article) {
        try {
            const message = this.formatMessage(article);
            const channels = this.getChannelsForCategory(article.category);
            for (const channel of channels) {
                if (channel) {
                    await this.sendWithRetry(channel, message, article.mainImage || null);
                }
            }
            await this.logDistribution(article._id || article.id, channels);
        }
        catch (error) {
            this.logger.error(`Distribution failed for ${article._id || article.id}`, error);
            await this.alertOnFailure(article._id || article.id, error);
        }
    }
    formatMessage(article) {
        const type = article.deepAnalysis ? '📊' : '🔥';
        const headline = (article.headline || article.title || 'Breaking News').substring(0, 60);
        const summaryLimit = article.deepAnalysis ? 180 : 200;
        let summaryText = article.summary ? article.summary.substring(0, summaryLimit) : 'Check out this new update!';
        if (article.deepAnalysis)
            summaryText += '... Read the full deep analysis inside';
        const url = `${this.baseUrl}/articles/${article.slug || article._id}`;
        const tags = (article.tags || []).map((t) => `#${t.replace(/\s+/g, '')}`).join(' ');
        if (article.deepAnalysis) {
            return `${type} **${headline}**\n\n${summaryText}\n\nCategory: #${article.category || 'news'}\nDeep Dive: ${article.wordCount || 700}+ words\n\n[Read Full Analysis](${url}) | ${tags}`;
        }
        return `${type} **${headline}**\n\n${summaryText}\n\nCategory: #${article.category || 'news'}\n👁️ ${article.views || 0} views  |  🔗 ${article.clicks || 0} clicks\n\n[Read Full Article](${url}) | ${tags}`;
    }
    getChannelsForCategory(category) {
        const mainChannel = this.configService.get('TELEGRAM_MAIN_CHANNEL') || this.configService.get('TELEGRAM_CHAT_ID') || '';
        const categoryChannels = {
            'tech': this.configService.get('TELEGRAM_TECH_CHANNEL'),
            'ai': this.configService.get('TELEGRAM_AI_CHANNEL'),
            'startup': this.configService.get('TELEGRAM_STARTUP_CHANNEL')
        };
        const targetCat = category ? category.toLowerCase() : '';
        const catChannel = categoryChannels[targetCat] || this.configService.get(`TELEGRAM_CHAT_ID_${category?.toUpperCase()}`);
        return [mainChannel, catChannel].filter(Boolean);
    }
    async sendWithRetry(channel, message, imageUrl, maxRetries = 3) {
        const botToken = this.configService.get('TELEGRAM_BOT_TOKEN');
        if (!botToken) {
            this.logger.warn('TELEGRAM_BOT_TOKEN is not defined. Cannot send message.');
            return;
        }
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const formData = new FormData();
                formData.append('chat_id', channel);
                formData.append('text', message);
                formData.append('parse_mode', 'Markdown');
                formData.append('disable_web_page_preview', 'false');
                if (imageUrl) {
                    formData.append('photo', imageUrl);
                    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                        method: 'POST',
                        body: formData,
                    });
                    if (!response.ok) {
                        this.logger.warn(`Failed to sendPhoto to Telegram: ${response.statusText}. Retrying with sendMessage.`);
                        const formText = new FormData();
                        formText.append('chat_id', channel);
                        formText.append('text', message);
                        formText.append('parse_mode', 'Markdown');
                        formText.append('disable_web_page_preview', 'false');
                        const fallbackRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, { method: 'POST', body: formText });
                        if (!fallbackRes.ok)
                            throw new Error(`Telegram API fallback error: ${fallbackRes.statusText}`);
                    }
                    return;
                }
                else {
                    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                        method: 'POST',
                        body: formData,
                    });
                    if (!response.ok) {
                        throw new Error(`Telegram API error: ${response.statusText}`);
                    }
                    return;
                }
            }
            catch (error) {
                if (attempt < maxRetries) {
                    await this.delay(Math.pow(2, attempt) * 1000);
                }
                else {
                    throw error;
                }
            }
        }
    }
    async scheduleDistribution(article) {
        if (!this.scheduleQueue) {
            this.logger.warn('Bull scheduleQueue is not injected. Skipping scheduling.');
            return;
        }
        const optimalTimes = ['9:00', '12:00', '17:00', '21:00'];
        for (const time of optimalTimes) {
            await this.scheduleQueue.add(`distribute_${article._id || article.id}_${time}`, { articleId: article._id || article.id }, {
                repeat: {
                    pattern: `0 ${time.split(':')[0]} * * *`
                }
            });
        }
    }
    async logDistribution(articleId, channels) {
        this.logger.log(`Successfully distributed Article[${articleId}] to channels: ${channels.join(', ')}`);
    }
    async alertOnFailure(articleId, error) {
        this.logger.error(`Critical Final Failure for Article[${articleId}] Telegram propagation: ${error.message}`);
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('scheduleQueue')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        bullmq_2.Queue])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map