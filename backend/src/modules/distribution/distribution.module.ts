import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TwitterService } from './twitter.service';
import { FacebookService } from './facebook.service';
import { DistributionService } from './distribution.service';
import { NewsletterService } from './newsletter.service';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        ConfigModule,
        BullModule.registerQueue({
            name: 'scheduleQueue',
        }),
    ],
    providers: [TelegramService, TwitterService, FacebookService, DistributionService, NewsletterService],
    exports: [TelegramService, TwitterService, FacebookService, DistributionService, NewsletterService],
})
export class DistributionModule { }
