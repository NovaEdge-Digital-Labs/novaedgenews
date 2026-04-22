import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
    // Content
    @Prop({ required: true, index: true })
    title: string;

    @Prop({ index: true })
    alternativeTitle: string; // Legacy

    @Prop({ required: true, unique: true, index: true })
    slug: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    summary: string;

    @Prop()
    quickNews: string;

    @Prop({
        type: {
            content: { type: String },
            wordCount: { type: Number },
            readingTimeMinutes: { type: Number },
            generatedAt: { type: Date },
            status: { type: String, enum: ['pending', 'generated', 'failed'], default: 'pending' },
        },
        default: null,
    })
    deepAnalysis: {
        content: string;
        wordCount: number;
        readingTimeMinutes: number;
        generatedAt: Date;
        status: 'pending' | 'generated' | 'failed';
    };

    @Prop({ type: String, enum: ['quick_news', 'deep_analysis', 'both'], default: 'quick_news' })
    articleType: 'quick_news' | 'deep_analysis' | 'both';

    @Prop()
    headline: string;

    // Metadata
    @Prop({ index: true })
    category: string;

    @Prop([String])
    tags: string[];

    @Prop()
    source: string;

    @Prop()
    sourceUrl: string;

    @Prop()
    author: string;

    // Images
    @Prop()
    mainImage: string;

    @Prop()
    imageAlt: string;

    @Prop()
    image: string; // Legacy compatibility

    @Prop()
    imageSource: string; // Legacy

    // Dates
    @Prop({ index: true })
    publishedAt: Date;

    @Prop({ index: true })
    liveDate: Date;

    // Status
    @Prop({ default: 'draft', index: true })
    status: string; // "draft", "published", "rejected"

    @Prop({ default: false, index: true })
    isLive: boolean;

    // SEO
    @Prop()
    metaTitle: string;

    @Prop()
    metaDescription: string;

    @Prop([String])
    metaKeywords: string[];

    @Prop([String])
    keywords: string[]; // Legacy compatibility

    // Analytics
    @Prop({ default: 0 })
    views: number;

    @Prop({ default: 0 })
    clicks: number;

    @Prop({ default: 0 })
    ctr: number;

    @Prop({ default: 0 })
    shareCount: number;

    @Prop({ default: 0 })
    commentCount: number;

    // Legacy Analytics
    @Prop({ default: 0, index: true })
    impressions: number;

    @Prop({ default: 0 })
    impressionsA: number;

    @Prop({ default: 0 })
    impressionsB: number;

    @Prop({ default: 0 })
    clicksA: number;

    @Prop({ default: 0 })
    clicksB: number;

    // Quality & Optimization
    @Prop({ default: 0 })
    qualityScore: number;

    @Prop({ default: 0 })
    score: number; // Legacy

    @Prop({ type: String, enum: ['A', 'B'], default: null })
    headlineVariant: 'A' | 'B' | null;

    @Prop({ type: String, enum: ['A', 'B'], default: null })
    preferredVariant: 'A' | 'B' | null; // Legacy

    @Prop({ default: 0, index: true })
    performanceScore: number;

    @Prop({ default: 0, index: true })
    trendingScore: number; // Legacy

    // Internal & Helper
    @Prop({ index: true })
    contentHash: string;

    @Prop()
    readingTime: number;

    @Prop()
    wordCount: number;

    @Prop({
        type: {
            metaTitle: { type: String },
            metaDescription: { type: String },
            metaKeywords: { type: [String] },
            og: {
                title: { type: String },
                description: { type: String },
                image: { type: String },
                url: { type: String },
                type: { type: String, default: 'article' }
            },
            twitter: {
                card: { type: String, default: 'summary_large_image' },
                creator: { type: String, default: '@novaedgenews' },
                title: { type: String },
                description: { type: String },
                image: { type: String }
            },
            schema: { type: Object },
            generatedAt: { type: Date },
            updatedAt: { type: Date }
        },
        default: {}
    })
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords?: string[];
        og?: {
            title: string;
            description: string;
            image: string;
            url: string;
            type: string;
        };
        twitter?: {
            card: string;
            creator: string;
            title: string;
            description: string;
            image: string;
        };
        schema?: Record<string, any>;
        generatedAt?: Date;
        updatedAt?: Date;
    };

    @Prop()
    insight: string;

    @Prop({ default: false, index: true })
    isEditorPick: boolean;

    @Prop({ default: false, index: true })
    isDistributed: boolean;

    @Prop({ type: Object })
    headlineA: { text: string; type: string; keywords: string[] };

    @Prop({ type: Object })
    headlineB: { text: string; type: string; keywords: string[] };

    @Prop({ default: true })
    testingActive: boolean;

    @Prop({ default: null })
    testStartDate: Date;

    @Prop({ default: null })
    testEndDate: Date;

    // Advanced analytics per variant
    @Prop({ default: 0 }) bounceCountA: number;
    @Prop({ default: 0 }) bounceCountB: number;
    @Prop({ default: 0 }) totalTimeOnPageA: number;
    @Prop({ default: 0 }) totalTimeOnPageB: number;

    @Prop({ type: Object })
    aiMetadata: any; // Legacy

    @Prop({ type: Map, of: Number, default: {} })
    trafficSources: Map<string, number>;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

// Helper for slug generation
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

// Auto-publishing and initialization middleware
ArticleSchema.pre('validate', async function () {
    if (this.isNew) {
        // 1. Slug generation
        if (!this.slug && this.title) {
            this.slug = slugify(this.title);
        }

        // 2. Assign category from tags
        if (!this.category && this.tags && this.tags.length > 0) {
            this.category = this.tags[0];
        }

        // 3-5. Status and Live details
        this.status = 'published';
        this.isLive = true;
        this.liveDate = new Date();
        if (!this.publishedAt) {
            this.publishedAt = this.liveDate;
        }

        // 6. Create SEO metadata
        if (!this.metaTitle) {
            this.metaTitle = this.title.slice(0, 60);
        }
        if (!this.metaDescription) {
            this.metaDescription = this.summary.slice(0, 160);
        }
        if (!this.metaKeywords || this.metaKeywords.length === 0) {
            this.metaKeywords = this.tags;
        }
        // Sync legacy SEO fields
        if (!this.keywords || this.keywords.length === 0) {
            this.keywords = this.tags;
        }

        // 7. Analytics initialization is handled by defaults (0)
    } else {
        // Sync CTR on update
        if (this.views > 0) {
            this.ctr = this.clicks / this.views;
        }
    }
});

// Indexes
ArticleSchema.index({ publishedAt: -1, status: 1 });
ArticleSchema.index({ category: 1, status: 1 });
ArticleSchema.index({ performanceScore: -1, status: 1 });
ArticleSchema.index({ trendingScore: -1, status: 1 });
