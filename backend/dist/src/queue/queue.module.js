"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationQueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const news_module_1 = require("../modules/news/news.module");
const ai_module_1 = require("../modules/ai/ai.module");
const publisher_module_1 = require("../modules/publisher/publisher.module");
const analytics_module_1 = require("../modules/analytics/analytics.module");
const image_module_1 = require("../modules/image/image.module");
const distribution_module_1 = require("../modules/distribution/distribution.module");
const newsletter_module_1 = require("../modules/newsletter/newsletter.module");
const extractor_module_1 = require("../modules/extractor/extractor.module");
const news_processor_1 = require("./news.processor");
const mongoose_1 = require("@nestjs/mongoose");
const rejection_schema_1 = require("../schemas/rejection.schema");
const article_schema_1 = require("../schemas/article.schema");
let AutomationQueueModule = class AutomationQueueModule {
};
exports.AutomationQueueModule = AutomationQueueModule;
exports.AutomationQueueModule = AutomationQueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'news-automation',
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 5000,
                    },
                },
            }),
            news_module_1.NewsModule,
            ai_module_1.AIModule,
            publisher_module_1.PublisherModule,
            analytics_module_1.AnalyticsModule,
            image_module_1.ImageModule,
            distribution_module_1.DistributionModule,
            newsletter_module_1.NewsletterModule,
            extractor_module_1.ExtractorModule,
            mongoose_1.MongooseModule.forFeature([
                { name: rejection_schema_1.Rejection.name, schema: rejection_schema_1.RejectionSchema },
                { name: article_schema_1.Article.name, schema: article_schema_1.ArticleSchema },
            ]),
        ],
        providers: [news_processor_1.NewsProcessor],
        exports: [
            bullmq_1.BullModule,
            news_module_1.NewsModule,
            ai_module_1.AIModule,
            publisher_module_1.PublisherModule,
            analytics_module_1.AnalyticsModule,
            image_module_1.ImageModule,
            distribution_module_1.DistributionModule,
            newsletter_module_1.NewsletterModule,
            extractor_module_1.ExtractorModule,
        ],
    })
], AutomationQueueModule);
//# sourceMappingURL=queue.module.js.map