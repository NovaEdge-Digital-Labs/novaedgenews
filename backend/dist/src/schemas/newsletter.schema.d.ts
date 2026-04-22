import { Document } from 'mongoose';
export type NewsletterDocument = Newsletter & Document;
export declare class Newsletter {
    date: Date;
    subject: string;
    articles: {
        articleId: string;
        title: string;
        summary: string;
        link: string;
        category: string;
    }[];
    sentTo: number;
    opens: number;
    clicks: number;
    bounces: number;
}
export declare const NewsletterSchema: import("mongoose").Schema<Newsletter, import("mongoose").Model<Newsletter, any, any, any, any, any, Newsletter>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Newsletter, Document<unknown, {}, Newsletter, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Newsletter & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, Newsletter, Document<unknown, {}, Newsletter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Newsletter & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subject?: import("mongoose").SchemaDefinitionProperty<string, Newsletter, Document<unknown, {}, Newsletter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Newsletter & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    articles?: import("mongoose").SchemaDefinitionProperty<{
        articleId: string;
        title: string;
        summary: string;
        link: string;
        category: string;
    }[], Newsletter, Document<unknown, {}, Newsletter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Newsletter & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sentTo?: import("mongoose").SchemaDefinitionProperty<number, Newsletter, Document<unknown, {}, Newsletter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Newsletter & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    opens?: import("mongoose").SchemaDefinitionProperty<number, Newsletter, Document<unknown, {}, Newsletter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Newsletter & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    clicks?: import("mongoose").SchemaDefinitionProperty<number, Newsletter, Document<unknown, {}, Newsletter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Newsletter & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bounces?: import("mongoose").SchemaDefinitionProperty<number, Newsletter, Document<unknown, {}, Newsletter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Newsletter & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Newsletter>;
