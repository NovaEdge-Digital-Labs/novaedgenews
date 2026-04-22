import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { NewsDiscoveryService } from './news-discovery.service';
import { NewsDiscoveryController } from './news-discovery.controller';
import { Article, ArticleSchema } from '../../schemas/article.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
        HttpModule,
    ],
    controllers: [NewsDiscoveryController],
    providers: [NewsDiscoveryService],
    exports: [NewsDiscoveryService],
})
export class NewsDiscoveryModule { }
