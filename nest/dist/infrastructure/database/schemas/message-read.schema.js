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
exports.MessageReadSchema = exports.MessageRead = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let MessageRead = class MessageRead {
};
exports.MessageRead = MessageRead;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], MessageRead.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MessageRead.prototype, "messageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MessageRead.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: () => new Date() }),
    __metadata("design:type", Date)
], MessageRead.prototype, "readAt", void 0);
exports.MessageRead = MessageRead = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        _id: false
    })
], MessageRead);
exports.MessageReadSchema = mongoose_1.SchemaFactory.createForClass(MessageRead);
exports.MessageReadSchema.index({ messageId: 1, userId: 1 }, { unique: true });
exports.MessageReadSchema.index({ userId: 1 });
//# sourceMappingURL=message-read.schema.js.map