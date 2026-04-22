import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OptimizationService } from './optimization.service';
import { Article, ArticleSchema } from '../../schemas/article.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])
    ],
    providers: [OptimizationService],
    exports: [OptimizationService],
})
export class OptimizationModule { }
