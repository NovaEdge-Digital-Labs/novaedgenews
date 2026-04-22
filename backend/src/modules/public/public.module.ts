import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicController } from './public.controller';
import { Article, ArticleSchema } from '../../schemas/article.schema';
import { AnalyticsModule } from '../analytics/analytics.module';
import { SEOService } from './seo.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
        AnalyticsModule,
    ],
    controllers: [PublicController],
    providers: [SEOService],
})
export class PublicModule { }
