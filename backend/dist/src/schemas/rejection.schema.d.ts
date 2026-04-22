import { Document } from 'mongoose';
export type RejectionDocument = Rejection & Document;
export declare class Rejection {
    originalTitle: string;
    reason: string;
    source: string;
    sourceUrl: string;
    context: any;
}
export declare const RejectionSchema: import("mongoose").Schema<Rejection, import("mongoose").Model<Rejection, any, any, any, any, any, Rejection>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Rejection, Document<unknown, {}, Rejection, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Rejection & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    originalTitle?: import("mongoose").SchemaDefinitionProperty<string, Rejection, Document<unknown, {}, Rejection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rejection & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, Rejection, Document<unknown, {}, Rejection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rejection & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, Rejection, Document<unknown, {}, Rejection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rejection & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sourceUrl?: import("mongoose").SchemaDefinitionProperty<string, Rejection, Document<unknown, {}, Rejection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rejection & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    context?: import("mongoose").SchemaDefinitionProperty<any, Rejection, Document<unknown, {}, Rejection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rejection & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Rejection>;
