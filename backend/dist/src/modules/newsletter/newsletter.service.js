"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NewsletterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const sgMail = __importStar(require("@sendgrid/mail"));
const uuid_1 = require("uuid");
const subscriber_schema_1 = require("../../schemas/subscriber.schema");
const newsletter_schema_1 = require("../../schemas/newsletter.schema");
const article_schema_1 = require("../../schemas/article.schema");
let NewsletterService = NewsletterService_1 = class NewsletterService {
    subscriberModel;
    newsletterModel;
    articleModel;
    configService;
    logger = new common_1.Logger(NewsletterService_1.name);
    constructor(subscriberModel, newsletterModel, articleModel, configService) {
        this.subscriberModel = subscriberModel;
        this.newsletterModel = newsletterModel;
        this.articleModel = articleModel;
        this.configService = configService;
        const apiKey = this.configService.get('SENDGRID_API_KEY');
        if (apiKey) {
            sgMail.setApiKey(apiKey);
        }
        else {
            this.logger.warn('SENDGRID_API_KEY not found. Emails will not be sent.');
        }
    }
    async subscribe(email, preferences) {
        const existing = await this.subscriberModel.findOne({ email });
        if (existing) {
            if (existing.status === 'subscribed') {
                throw new common_1.ConflictException('Already subscribed');
            }
            existing.status = 'subscribed';
            existing.preferences = preferences || existing.preferences;
            return await existing.save();
        }
        const subscriber = new this.subscriberModel({
            email,
            preferences,
            unsubscribeToken: (0, uuid_1.v4)(),
        });
        return await subscriber.save();
    }
    async unsubscribe(token) {
        const subscriber = await this.subscriberModel.findOne({ unsubscribeToken: token });
        if (!subscriber) {
            throw new common_1.NotFoundException('Invalid unsubscribe token');
        }
        subscriber.status = 'unsubscribed';
        return await subscriber.save();
    }
    async sendDailyDigest() {
        this.logger.log('Generating daily digest...');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const articles = await this.articleModel.find({
            publishedAt: { $gte: today },
            status: 'published'
        })
            .sort({ trendingScore: -1, performanceScore: -1, views: -1 })
            .limit(10);
        if (articles.length === 0) {
            this.logger.log('No articles found for daily digest today.');
            return;
        }
        const subscribers = await this.subscriberModel.find({ status: 'subscribed' });
        if (subscribers.length === 0) {
            this.logger.log('No active subscribers found.');
            return;
        }
        const subject = `NovaEdge News Daily Digest - ${new Date().toLocaleDateString()}`;
        const articleList = articles.map(a => ({
            articleId: a._id.toString(),
            title: a.title,
            summary: a.summary,
            link: `https://news.novaedge.in/articles/${a.slug}`,
            category: a.category
        }));
        const newsletter = await this.newsletterModel.create({
            date: new Date(),
            subject,
            articles: articleList,
            sentTo: subscribers.length
        });
        for (const sub of subscribers) {
            try {
                const html = this.generateHtml(articles, sub.unsubscribeToken, newsletter._id.toString());
                await sgMail.send({
                    to: sub.email,
                    from: 'newsletter@novaedge.in',
                    subject,
                    html,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send newsletter to ${sub.email}`, error.stack);
            }
        }
        this.logger.log(`Daily digest sent to ${subscribers.length} subscribers.`);
        return newsletter;
    }
    async trackOpen(newsletterId) {
        return await this.newsletterModel.findByIdAndUpdate(newsletterId, { $inc: { opens: 1 } });
    }
    async trackClick(newsletterId) {
        return await this.newsletterModel.findByIdAndUpdate(newsletterId, { $inc: { clicks: 1 } });
    }
    generateHtml(articles, unsubscribeToken, newsletterId) {
        const baseUrl = 'https://news.novaedge.in';
        const apiBaseUrl = 'http://localhost:3005';
        const articleItems = articles.map(a => {
            const trackingLink = `${apiBaseUrl}/newsletter/track-click?newsletterId=${newsletterId}&redirect=${encodeURIComponent(`${baseUrl}/articles/${a.slug}`)}`;
            return `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <h3 style="margin: 0;"><a href="${trackingLink}" style="color: #0070f3; text-decoration: none;">${a.title}</a></h3>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">${a.summary}</p>
                <span style="background: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${a.category}</span>
            </div>
        `;
        }).join('');
        const openTrackingPixel = newsletterId ? `<img src="${apiBaseUrl}/newsletter/track-open?newsletterId=${newsletterId}" width="1" height="1" style="display:none;" />` : '';
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h1 style="text-align: center; color: #333;">NovaEdge News</h1>
                <p style="text-align: center; color: #999;">Your Daily Tech & AI Update</p>
                <hr />
                ${articleItems}
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
                    <p>You are receiving this because you subscribed to NovaEdge News.</p>
                    <a href="${baseUrl}/unsubscribe?token=${unsubscribeToken}" style="color: #999;">Unsubscribe</a>
                </div>
                ${openTrackingPixel}
            </div>
        `;
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = NewsletterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscriber_schema_1.Subscriber.name)),
    __param(1, (0, mongoose_1.InjectModel)(newsletter_schema_1.Newsletter.name)),
    __param(2, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map