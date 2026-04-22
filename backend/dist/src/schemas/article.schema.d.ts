import { Document } from 'mongoose';
export type ArticleDocument = Article & Document;
export declare class Article {
    title: string;
    alternativeTitle: string;
    slug: string;
    content: string;
    summary: string;
    quickNews: string;
    deepAnalysis: {
        content: string;
        wordCount: number;
        readingTimeMinutes: number;
        generatedAt: Date;
        status: 'pending' | 'generated' | 'failed';
    };
    articleType: 'quick_news' | 'deep_analysis' | 'both';
    headline: string;
    category: string;
    tags: string[];
    source: string;
    sourceUrl: string;
    author: string;
    mainImage: string;
    imageAlt: string;
    image: string;
    imageSource: string;
    publishedAt: Date;
    liveDate: Date;
    status: string;
    isLive: boolean;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    keywords: string[];
    views: number;
    clicks: number;
    ctr: number;
    shareCount: number;
    commentCount: number;
    impressions: number;
    impressionsA: number;
    impressionsB: number;
    clicksA: number;
    clicksB: number;
    qualityScore: number;
    score: number;
    headlineVariant: 'A' | 'B' | null;
    preferredVariant: 'A' | 'B' | null;
    performanceScore: number;
    trendingScore: number;
    contentHash: string;
    readingTime: number;
    wordCount: number;
    seo: Record<string, any>;
    insight: string;
    isEditorPick: boolean;
    isDistributed: boolean;
    headlineA: {
        text: string;
        type: string;
        keywords: string[];
    };
    headlineB: {
        text: string;
        type: string;
        keywords: string[];
    };
    testingActive: boolean;
    testStartDate: Date;
    testEndDate: Date;
    bounceCountA: number;
    bounceCountB: number;
    totalTimeOnPageA: number;
    totalTimeOnPageB: number;
    aiMetadata: any;
    trafficSources: Map<string, number>;
}
export declare const ArticleSchema: import("mongoose").Schema<Article, import("mongoose").Model<Article, any, any, any, any, any, Article>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Article, Document<unknown, {}, Article, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    alternativeTitle?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    summary?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quickNews?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deepAnalysis?: import("mongoose").SchemaDefinitionProperty<{
        content: string;
        wordCount: number;
        readingTimeMinutes: number;
        generatedAt: Date;
        status: "pending" | "generated" | "failed";
    }, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    articleType?: import("mongoose").SchemaDefinitionProperty<"quick_news" | "deep_analysis" | "both", Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    headline?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sourceUrl?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    author?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mainImage?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    imageAlt?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    image?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    imageSource?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    publishedAt?: import("mongoose").SchemaDefinitionProperty<Date, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    liveDate?: import("mongoose").SchemaDefinitionProperty<Date, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isLive?: import("mongoose").SchemaDefinitionProperty<boolean, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metaTitle?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metaDescription?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metaKeywords?: import("mongoose").SchemaDefinitionProperty<string[], Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    keywords?: import("mongoose").SchemaDefinitionProperty<string[], Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    views?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    clicks?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ctr?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    shareCount?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    commentCount?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    impressions?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    impressionsA?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    impressionsB?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    clicksA?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    clicksB?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualityScore?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    score?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    headlineVariant?: import("mongoose").SchemaDefinitionProperty<"A" | "B" | null, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    preferredVariant?: import("mongoose").SchemaDefinitionProperty<"A" | "B" | null, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    performanceScore?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    trendingScore?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contentHash?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readingTime?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    wordCount?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    seo?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    insight?: import("mongoose").SchemaDefinitionProperty<string, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isEditorPick?: import("mongoose").SchemaDefinitionProperty<boolean, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isDistributed?: import("mongoose").SchemaDefinitionProperty<boolean, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    headlineA?: import("mongoose").SchemaDefinitionProperty<{
        text: string;
        type: string;
        keywords: string[];
    }, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    headlineB?: import("mongoose").SchemaDefinitionProperty<{
        text: string;
        type: string;
        keywords: string[];
    }, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    testingActive?: import("mongoose").SchemaDefinitionProperty<boolean, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    testStartDate?: import("mongoose").SchemaDefinitionProperty<Date, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    testEndDate?: import("mongoose").SchemaDefinitionProperty<Date, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bounceCountA?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bounceCountB?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalTimeOnPageA?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalTimeOnPageB?: import("mongoose").SchemaDefinitionProperty<number, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aiMetadata?: import("mongoose").SchemaDefinitionProperty<any, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    trafficSources?: import("mongoose").SchemaDefinitionProperty<Map<string, number>, Article, Document<unknown, {}, Article, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Article>;
