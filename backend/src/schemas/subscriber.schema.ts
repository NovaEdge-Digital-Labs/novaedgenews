import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriberDocument = Subscriber & Document;

@Schema({ timestamps: true })
export class Subscriber {
    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ type: String, enum: ['subscribed', 'unsubscribed', 'bounced'], default: 'subscribed', index: true })
    status: string;

    @Prop({ default: Date.now })
    subscriptionDate: Date;

    @Prop()
    confirmationToken?: string;

    @Prop({ default: false })
    isConfirmed: boolean;

    @Prop({
        type: {
            frequency: { type: String, enum: ['daily', 'weekly', 'instantly'], default: 'daily' },
            categories: { type: [String], default: [] },
            deepAnalysisOnly: { type: Boolean, default: false },
            receiveDigests: { type: Boolean, default: true }
        },
        default: {
            frequency: 'daily',
            categories: [],
            deepAnalysisOnly: false,
            receiveDigests: true
        },
    })
    preferences: {
        frequency: 'daily' | 'weekly' | 'instantly';
        categories: string[];
        deepAnalysisOnly: boolean;
        receiveDigests: boolean;
    };

    @Prop({
        type: {
            totalEmails: { type: Number, default: 0 },
            openCount: { type: Number, default: 0 },
            clickCount: { type: Number, default: 0 },
            openRate: { type: Number, default: 0 },
            clickRate: { type: Number, default: 0 },
            lastOpenDate: { type: Date, default: null },
            lastClickDate: { type: Date, default: null },
            unsubscribeDate: { type: Date, default: null },
        },
        default: {
            totalEmails: 0,
            openCount: 0,
            clickCount: 0,
            openRate: 0,
            clickRate: 0,
            lastOpenDate: null,
            lastClickDate: null,
            unsubscribeDate: null,
        },
    })
    engagementMetrics: {
        totalEmails: number;
        openCount: number;
        clickCount: number;
        openRate: number;
        clickRate: number;
        lastOpenDate: Date | null;
        lastClickDate: Date | null;
        unsubscribeDate: Date | null;
    };

    @Prop({ enum: ['homepage', 'article', 'telegram', 'unknown'], default: 'unknown' })
    source: string;

    @Prop()
    ipAddress?: string;

    @Prop()
    userAgent?: string;

    @Prop({ unique: true, index: true, sparse: true })
    unsubscribeToken: string;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);

SubscriberSchema.index({ email: 1, status: 1 });
