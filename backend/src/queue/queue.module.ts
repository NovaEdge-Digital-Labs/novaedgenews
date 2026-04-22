import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NewsModule } from '../modules/news/news.module';
import { AIModule } from '../modules/ai/ai.module';
import { PublisherModule } from '../modules/publisher/publisher.module';
import { AnalyticsModule } from '../modules/analytics/analytics.module';
import { ImageModule } from '../modules/image/image.module';
import { DistributionModule } from '../modules/distribution/distribution.module';
import { NewsletterModule } from '../modules/newsletter/newsletter.module';
import { ExtractorModule } from '../modules/extractor/extractor.module';
import { NewsProcessor } from './news.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { Rejection, RejectionSchema } from '../schemas/rejection.schema';
import { Article, ArticleSchema } from '../schemas/article.schema';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'news-automation',
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
            },
        }),
        NewsModule,
        AIModule,
        PublisherModule,
        AnalyticsModule,
        ImageModule,
        DistributionModule,
        NewsletterModule,
        ExtractorModule,
        MongooseModule.forFeature([
            { name: Rejection.name, schema: RejectionSchema },
            { name: Article.name, schema: ArticleSchema },
        ]),
    ],
    providers: [NewsProcessor],
    exports: [
        BullModule,
        NewsModule,
        AIModule,
        PublisherModule,
        AnalyticsModule,
        ImageModule,
        DistributionModule,
        NewsletterModule,
        ExtractorModule,
    ],
})
export class AutomationQueueModule { }
