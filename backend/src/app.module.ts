import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';

import { NewsModule } from './modules/news/news.module';
import { AIModule } from './modules/ai/ai.module';
import { PublisherModule } from './modules/publisher/publisher.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { PublicModule } from './modules/public/public.module';
import { ImageModule } from './modules/image/image.module';
import { OptimizationModule } from './modules/optimization/optimization.module';
import { NewsDiscoveryModule } from './modules/news-discovery/news-discovery.module';
import { ExtractorModule } from './modules/extractor/extractor.module';
import { AutomationQueueModule } from './queue/queue.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { SeoModule } from './modules/seo/seo.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { Article, ArticleSchema } from './schemas/article.schema';
import { Rejection, RejectionSchema } from './schemas/rejection.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // I'll check AppModule first.
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: Rejection.name, schema: RejectionSchema },
    ]),
    AutomationQueueModule,
    NewsModule,
    AIModule,
    PublisherModule,
    SchedulerModule,
    PublicModule,
    ImageModule,
    OptimizationModule,
    NewsDiscoveryModule,
    ExtractorModule,
    NewsletterModule,
    SeoModule,
    NotificationsModule,
    AdminModule,
  ],
})
export class AppModule { }
