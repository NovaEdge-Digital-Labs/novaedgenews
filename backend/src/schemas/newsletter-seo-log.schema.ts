import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterSeoLogDocument = NewsletterSeoLog & Document;

@Schema({ timestamps: true })
export class NewsletterSeoLog {
    @Prop({ required: true, default: Date.now, index: true })
    timestamp: Date;

    @Prop({ required: true, enum: ['pre_newsletter_check', 'newsletter_send', 'sitemap_sync', 'seo_health_check', 'weekly_analytics'] })
    phase: string;

    @Prop({ required: true, enum: ['success', 'partial', 'failed'] })
    status: string;

    @Prop({ type: Object })
    metrics: {
        articlesProcessed?: number;
        articlesFixed?: number;
        emailsSent?: number;
        subscribersTargeted?: number;
        sitemapEntries?: number;
        executionTimeMs?: number;
        errors?: string[];
    };

    @Prop([String])
    logs: string[];

    @Prop({ type: Object })
    alertsSent: {
        telegram: boolean;
        email: boolean;
    };
}

export const NewsletterSeoLogSchema = SchemaFactory.createForClass(NewsletterSeoLog);
