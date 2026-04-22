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
exports.SubscriberSchema = exports.Subscriber = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Subscriber = class Subscriber {
    email;
    status;
    subscriptionDate;
    preferences;
    engagementMetrics;
    unsubscribeToken;
};
exports.Subscriber = Subscriber;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Subscriber.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['subscribed', 'unsubscribed', 'bounced'], default: 'subscribed', index: true }),
    __metadata("design:type", String)
], Subscriber.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Subscriber.prototype, "subscriptionDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            frequency: { type: String, enum: ['daily', 'weekly', 'instantly'], default: 'daily' },
            categories: { type: [String], default: [] },
            deepAnalysisOnly: { type: Boolean, default: false },
        },
        default: {
            frequency: 'daily',
            categories: [],
            deepAnalysisOnly: false,
        },
    }),
    __metadata("design:type", Object)
], Subscriber.prototype, "preferences", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            openRate: { type: Number, default: 0 },
            clickRate: { type: Number, default: 0 },
            lastOpenDate: { type: Date, default: null },
        },
        default: {
            openRate: 0,
            clickRate: 0,
            lastOpenDate: null,
        },
    }),
    __metadata("design:type", Object)
], Subscriber.prototype, "engagementMetrics", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, index: true }),
    __metadata("design:type", String)
], Subscriber.prototype, "unsubscribeToken", void 0);
exports.Subscriber = Subscriber = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Subscriber);
exports.SubscriberSchema = mongoose_1.SchemaFactory.createForClass(Subscriber);
exports.SubscriberSchema.index({ email: 1, status: 1 });
//# sourceMappingURL=subscriber.schema.js.map