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
exports.NewsletterSchema = exports.Newsletter = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Newsletter = class Newsletter {
    date;
    subject;
    articles;
    sentTo;
    opens;
    clicks;
    bounces;
};
exports.Newsletter = Newsletter;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], Newsletter.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Newsletter.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                articleId: { type: String },
                title: { type: String },
                summary: { type: String },
                link: { type: String },
                category: { type: String },
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], Newsletter.prototype, "articles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Newsletter.prototype, "sentTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Newsletter.prototype, "opens", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Newsletter.prototype, "clicks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Newsletter.prototype, "bounces", void 0);
exports.Newsletter = Newsletter = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Newsletter);
exports.NewsletterSchema = mongoose_1.SchemaFactory.createForClass(Newsletter);
exports.NewsletterSchema.index({ date: -1 });
//# sourceMappingURL=newsletter.schema.js.map