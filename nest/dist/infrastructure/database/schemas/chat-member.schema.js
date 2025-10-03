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
exports.ChatMemberSchema = exports.ChatMember = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ChatMember = class ChatMember {
};
exports.ChatMember = ChatMember;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], ChatMember.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatMember.prototype, "chatId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatMember.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['admin', 'member'], default: 'member' }),
    __metadata("design:type", String)
], ChatMember.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ChatMember.prototype, "joinedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ChatMember.prototype, "isActive", void 0);
exports.ChatMember = ChatMember = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        _id: false
    })
], ChatMember);
exports.ChatMemberSchema = mongoose_1.SchemaFactory.createForClass(ChatMember);
exports.ChatMemberSchema.set('_id', true);
//# sourceMappingURL=chat-member.schema.js.map