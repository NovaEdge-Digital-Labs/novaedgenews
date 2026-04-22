"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const bullmq_1 = require("@nestjs/bullmq");
const schedule_1 = require("@nestjs/schedule");
const configuration_1 = __importDefault(require("./config/configuration"));
const news_module_1 = require("./modules/news/news.module");
const ai_module_1 = require("./modules/ai/ai.module");
const publisher_module_1 = require("./modules/publisher/publisher.module");
const scheduler_module_1 = require("./modules/scheduler/scheduler.module");
const public_module_1 = require("./modules/public/public.module");
const image_module_1 = require("./modules/image/image.module");
const optimization_module_1 = require("./modules/optimization/optimization.module");
const news_discovery_module_1 = require("./modules/news-discovery/news-discovery.module");
const extractor_module_1 = require("./modules/extractor/extractor.module");
const queue_module_1 = require("./queue/queue.module");
const newsletter_module_1 = require("./modules/newsletter/newsletter.module");
const seo_module_1 = require("./modules/seo/seo.module");
const admin_module_1 = require("./modules/admin/admin.module");
const article_schema_1 = require("./schemas/article.schema");
const rejection_schema_1 = require("./schemas/rejection.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [configuration_1.default],
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('database.uri'),
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    connection: {
                        host: configService.get('redis.host'),
                        port: configService.get('redis.port'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forFeature([
                { name: article_schema_1.Article.name, schema: article_schema_1.ArticleSchema },
                { name: rejection_schema_1.Rejection.name, schema: rejection_schema_1.RejectionSchema },
            ]),
            queue_module_1.AutomationQueueModule,
            news_module_1.NewsModule,
            ai_module_1.AIModule,
            publisher_module_1.PublisherModule,
            scheduler_module_1.SchedulerModule,
            public_module_1.PublicModule,
            image_module_1.ImageModule,
            optimization_module_1.OptimizationModule,
            news_discovery_module_1.NewsDiscoveryModule,
            extractor_module_1.ExtractorModule,
            newsletter_module_1.NewsletterModule,
            seo_module_1.SeoModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map