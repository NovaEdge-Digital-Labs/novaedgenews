import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublisherService } from './publisher.service';
import { Article, ArticleSchema } from '../../schemas/article.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    ],
    providers: [PublisherService],
    exports: [PublisherService],
})
export class PublisherModule { }
