"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleSchema = exports.Article = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Article = class Article {
    title;
    alternativeTitle;
    slug;
    content;
    summary;
    quickNews;
    deepAnalysis;
    articleType;
    headline;
    category;
    tags;
    source;
    sourceUrl;
    author;
    mainImage;
    imageAlt;
    image;
    imageSource;
    publishedAt;
    liveDate;
    status;
    isLive;
    metaTitle;
    metaDescription;
    metaKeywords;
    keywords;
    views;
    clicks;
    ctr;
    shareCount;
    commentCount;
    impressions;
    impressionsA;
    impressionsB;
    clicksA;
    clicksB;
    qualityScore;
    score;
    headlineVariant;
    preferredVariant;
    performanceScore;
    trendingScore;
    contentHash;
    readingTime;
    wordCount;
    seo;
    insight;
    isEditorPick;
    isDistributed;
    headlineA;
    headlineB;
    testingActive;
    testStartDate;
    testEndDate;
    bounceCountA;
    bounceCountB;
    totalTimeOnPageA;
    totalTimeOnPageB;
    aiMetadata;
    trafficSources;
};
exports.Article = Article;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Article.prototype, "alternativeTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Article.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "summary", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "quickNews", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            content: { type: String },
            wordCount: { type: Number },
            readingTimeMinutes: { type: Number },
            generatedAt: { type: Date },
            status: { type: String, enum: ['pending', 'generated', 'failed'], default: 'pending' },
        },
        default: null,
    }),
    __metadata("design:type", Object)
], Article.prototype, "deepAnalysis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['quick_news', 'deep_analysis', 'both'], default: 'quick_news' }),
    __metadata("design:type", String)
], Article.prototype, "articleType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "headline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Article.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Article.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "sourceUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "mainImage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "imageAlt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "imageSource", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Date)
], Article.prototype, "publishedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Date)
], Article.prototype, "liveDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'draft', index: true }),
    __metadata("design:type", String)
], Article.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Article.prototype, "isLive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "metaTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "metaDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Article.prototype, "metaKeywords", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Article.prototype, "keywords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "views", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "clicks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "ctr", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "shareCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "commentCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], Article.prototype, "impressions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "impressionsA", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "impressionsB", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "clicksA", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "clicksB", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "qualityScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['A', 'B'], default: null }),
    __metadata("design:type", Object)
], Article.prototype, "headlineVariant", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['A', 'B'], default: null }),
    __metadata("design:type", Object)
], Article.prototype, "preferredVariant", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], Article.prototype, "performanceScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], Article.prototype, "trendingScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Article.prototype, "contentHash", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Article.prototype, "readingTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Article.prototype, "wordCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Article.prototype, "seo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "insight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Article.prototype, "isEditorPick", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Article.prototype, "isDistributed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Article.prototype, "headlineA", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Article.prototype, "headlineB", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Article.prototype, "testingActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Article.prototype, "testStartDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Article.prototype, "testEndDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "bounceCountA", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "bounceCountB", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "totalTimeOnPageA", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "totalTimeOnPageB", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Article.prototype, "aiMetadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: Number, default: {} }),
    __metadata("design:type", Map)
], Article.prototype, "trafficSources", void 0);
exports.Article = Article = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Article);
exports.ArticleSchema = mongoose_1.SchemaFactory.createForClass(Article);
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}
exports.ArticleSchema.pre('validate', async function () {
    if (this.isNew) {
        if (!this.slug && this.title) {
            this.slug = slugify(this.title);
        }
        if (!this.category && this.tags && this.tags.length > 0) {
            this.category = this.tags[0];
        }
        this.status = 'published';
        this.isLive = true;
        this.liveDate = new Date();
        if (!this.publishedAt) {
            this.publishedAt = this.liveDate;
        }
        if (!this.metaTitle) {
            this.metaTitle = this.title.slice(0, 60);
        }
        if (!this.metaDescription) {
            this.metaDescription = this.summary.slice(0, 160);
        }
        if (!this.metaKeywords || this.metaKeywords.length === 0) {
            this.metaKeywords = this.tags;
        }
        if (!this.keywords || this.keywords.length === 0) {
            this.keywords = this.tags;
        }
    }
    else {
        if (this.views > 0) {
            this.ctr = this.clicks / this.views;
        }
    }
});
exports.ArticleSchema.index({ publishedAt: -1, status: 1 });
exports.ArticleSchema.index({ category: 1, status: 1 });
exports.ArticleSchema.index({ performanceScore: -1, status: 1 });
exports.ArticleSchema.index({ trendingScore: -1, status: 1 });
//# sourceMappingURL=article.schema.js.map