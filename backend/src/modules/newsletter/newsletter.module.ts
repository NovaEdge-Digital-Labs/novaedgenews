import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { Subscriber, SubscriberSchema } from '../../schemas/subscriber.schema';
import { Newsletter, NewsletterSchema } from '../../schemas/newsletter.schema';
import { Article, ArticleSchema } from '../../schemas/article.schema';
import { NewsletterEvent, NewsletterEventSchema } from '../../schemas/newsletter-event.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Subscriber.name, schema: SubscriberSchema },
            { name: Newsletter.name, schema: NewsletterSchema },
            { name: Article.name, schema: ArticleSchema },
            { name: NewsletterEvent.name, schema: NewsletterEventSchema },
        ]),
    ],
    providers: [NewsletterService],
    controllers: [NewsletterController],
    exports: [NewsletterService],
})
export class NewsletterModule { }
