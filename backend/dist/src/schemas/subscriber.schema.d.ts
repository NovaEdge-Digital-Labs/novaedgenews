import { Document } from 'mongoose';
export type SubscriberDocument = Subscriber & Document;
export declare class Subscriber {
    email: string;
    status: string;
    subscriptionDate: Date;
    preferences: {
        frequency: 'daily' | 'weekly' | 'instantly';
        categories: string[];
        deepAnalysisOnly: boolean;
    };
    engagementMetrics: {
        openRate: number;
        clickRate: number;
        lastOpenDate: Date;
    };
    unsubscribeToken: string;
}
export declare const SubscriberSchema: import("mongoose").Schema<Subscriber, import("mongoose").Model<Subscriber, any, any, any, any, any, Subscriber>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subscriber, Document<unknown, {}, Subscriber, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    email?: import("mongoose").SchemaDefinitionProperty<string, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subscriptionDate?: import("mongoose").SchemaDefinitionProperty<Date, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    preferences?: import("mongoose").SchemaDefinitionProperty<{
        frequency: "daily" | "weekly" | "instantly";
        categories: string[];
        deepAnalysisOnly: boolean;
    }, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    engagementMetrics?: import("mongoose").SchemaDefinitionProperty<{
        openRate: number;
        clickRate: number;
        lastOpenDate: Date;
    }, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unsubscribeToken?: import("mongoose").SchemaDefinitionProperty<string, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Subscriber>;
