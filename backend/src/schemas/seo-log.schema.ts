import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SeoLogDocument = SeoLog & Document;

@Schema({ timestamps: true })
export class SeoLog {
    @Prop({ required: true, default: Date.now, index: true })
    date: Date;

    @Prop({ required: true })
    articlesWithSEO: number;

    @Prop({ required: true })
    articlesWithoutSEO: number;

    @Prop({ required: true, enum: ['success', 'failed'] })
    sitemapStatus: 'success' | 'failed';

    @Prop({ required: true, enum: ['ok', 'error'] })
    robotsStatus: 'ok' | 'error';

    @Prop({ required: true })
    schemaValidation: number;

    @Prop([String])
    alerts: string[];
}

export const SeoLogSchema = SchemaFactory.createForClass(SeoLog);
