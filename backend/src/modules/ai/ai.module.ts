import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../../schemas/article.schema';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { QAService } from './qa.service';
import { DeepAnalysisService } from './deep-analysis.service';
import { HeadlineTestingService } from './headline-testing.service';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    ],
    controllers: [AIController],
    providers: [AIService, QAService, DeepAnalysisService, HeadlineTestingService],
    exports: [AIService, QAService, DeepAnalysisService, HeadlineTestingService],
})
export class AIModule { }
