import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Article, ArticleSchema } from '../../schemas/article.schema';
import { SeoLog, SeoLogSchema } from '../../schemas/seo-log.schema';
import { NewsletterSeoLog, NewsletterSeoLogSchema } from '../../schemas/newsletter-seo-log.schema';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { AIModule } from '../ai/ai.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
            { name: SeoLog.name, schema: SeoLogSchema },
            { name: NewsletterSeoLog.name, schema: NewsletterSeoLogSchema }
        ]),
        AIModule,
        ConfigModule,
    ],
    providers: [SeoService],
    controllers: [SeoController],
    exports: [SeoService],
})
export class SeoModule { }
