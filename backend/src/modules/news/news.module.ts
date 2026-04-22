import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { Article, ArticleSchema } from '../../schemas/article.schema';
import { AIModule } from '../ai/ai.module';
import { PublisherModule } from '../publisher/publisher.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
        HttpModule,
        AIModule,
        PublisherModule,
    ],
    controllers: [NewsController],
    providers: [NewsService],
    exports: [NewsService],
})
export class NewsModule { }
