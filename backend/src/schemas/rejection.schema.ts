import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RejectionDocument = Rejection & Document;

@Schema({ timestamps: true })
export class Rejection {
    @Prop({ required: true })
    originalTitle: string;

    @Prop({ required: true })
    reason: string;

    @Prop()
    source: string;

    @Prop()
    sourceUrl: string;

    @Prop({ type: Object })
    context: any;
}

export const RejectionSchema = SchemaFactory.createForClass(Rejection);
