import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, Res } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SubscribeDto, UnsubscribeDto, ConfirmDto } from './dto/subscribe.dto';

@Controller('newsletter')
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) { }

    @Post('subscribe')
    async subscribe(@Body() subscribeDto: SubscribeDto) {
        return await this.newsletterService.subscribe(subscribeDto.email, subscribeDto.preferences, subscribeDto.source);
    }

    @Post('confirm')
    @HttpCode(HttpStatus.OK)
    async confirm(@Body() confirmDto: ConfirmDto) {
        return await this.newsletterService.confirmSubscription(confirmDto.token);
    }

    @Post('unsubscribe')
    @HttpCode(HttpStatus.OK)
    async unsubscribe(@Body() unsubscribeDto: UnsubscribeDto) {
        return await this.newsletterService.unsubscribe(unsubscribeDto.token);
    }

    @Get('unsubscribe')
    async unsubscribeViaGet(@Query('token') token: string) {
        return await this.newsletterService.unsubscribe(token);
    }

    @Post('send-daily-digest')
    async triggerDailyDigest() {
        return await this.newsletterService.sendDailyDigest();
    }

    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handleWebhook(@Body() events: any[]) {
        if (Array.isArray(events)) {
            return await this.newsletterService.processWebhook(events);
        }
        return { success: false, message: 'Invalid payload' };
    }
}
