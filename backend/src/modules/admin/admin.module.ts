import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Article, ArticleSchema } from '../../schemas/article.schema';
import { Subscriber, SubscriberSchema } from '../../schemas/subscriber.schema';
import { Newsletter, NewsletterSchema } from '../../schemas/newsletter.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
            { name: Subscriber.name, schema: SubscriberSchema },
            { name: Newsletter.name, schema: NewsletterSchema },
        ]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
