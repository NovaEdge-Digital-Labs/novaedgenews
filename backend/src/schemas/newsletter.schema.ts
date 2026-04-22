import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type NewsletterDocument = Newsletter & Document;

@Schema({ timestamps: true })
export class Newsletter {
    @Prop()
    campaignId?: string; // SendGrid campaign ID if using Marketing Campaigns

    @Prop({ required: true })
    subject: string;

    @Prop()
    contentHtml?: string;

    @Prop()
    sentDate?: Date;

    @Prop({ type: String, enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'], default: 'draft', index: true })
    status: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Article' }] })
    articlesIncluded: Types.ObjectId[];

    @Prop({
        type: {
            targetCount: { type: Number, default: 0 },
            segment: { type: String, default: 'all' },
        },
        default: {
            targetCount: 0,
            segment: 'all'
        }
    })
    audience: {
        targetCount: number;
        segment: string;
    };

    @Prop({
        type: {
            delivered: { type: Number, default: 0 },
            opens: { type: Number, default: 0 },
            uniqueOpens: { type: Number, default: 0 },
            clicks: { type: Number, default: 0 },
            uniqueClicks: { type: Number, default: 0 },
            bounces: { type: Number, default: 0 },
            spamReports: { type: Number, default: 0 },
            unsubscribes: { type: Number, default: 0 }
        },
        default: {
            delivered: 0,
            opens: 0,
            uniqueOpens: 0,
            clicks: 0,
            uniqueClicks: 0,
            bounces: 0,
            spamReports: 0,
            unsubscribes: 0
        }
    })
    metrics: {
        delivered: number;
        opens: number;
        uniqueOpens: number;
        clicks: number;
        uniqueClicks: number;
        bounces: number;
        spamReports: number;
        unsubscribes: number;
    };
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);

NewsletterSchema.index({ sentDate: -1 });
NewsletterSchema.index({ status: 1 });
