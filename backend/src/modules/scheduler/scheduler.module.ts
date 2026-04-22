import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NewsletterSeoScheduler } from './newsletter-seo.scheduler';
import { AutomationQueueModule } from '../../queue/queue.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { OptimizationModule } from '../optimization/optimization.module';
import { SeoModule } from '../seo/seo.module';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsletterSeoLog, NewsletterSeoLogSchema } from '../../schemas/newsletter-seo-log.schema';

@Module({
    imports: [
        AutomationQueueModule,
        AnalyticsModule,
        OptimizationModule,
        SeoModule,
        NewsletterModule,
        MongooseModule.forFeature([{ name: NewsletterSeoLog.name, schema: NewsletterSeoLogSchema }])
    ],
    providers: [SchedulerService, NewsletterSeoScheduler],
    exports: [SchedulerService, NewsletterSeoScheduler],
})
export class SchedulerModule { }
