import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NewsletterEventDocument = NewsletterEvent & Document;

@Schema({ timestamps: true })
export class NewsletterEvent {
    @Prop({ required: true, index: true })
    email: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Newsletter', index: true })
    newsletterId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, enum: ['delivered', 'open', 'click', 'bounce', 'spamreport', 'unsubscribe'], index: true })
    event: string;

    @Prop({ required: true })
    timestamp: Date;

    @Prop()
    url?: string; // For click events

    @Prop()
    ip?: string;

    @Prop()
    userAgent?: string;

    @Prop()
    sendgridMessageId?: string;

    @Prop({ type: Object })
    rawPayload?: any; // Store exact payload from SendGrid for debugging
}

export const NewsletterEventSchema = SchemaFactory.createForClass(NewsletterEvent);

NewsletterEventSchema.index({ email: 1, event: 1 });
NewsletterEventSchema.index({ newsletterId: 1, event: 1 });
