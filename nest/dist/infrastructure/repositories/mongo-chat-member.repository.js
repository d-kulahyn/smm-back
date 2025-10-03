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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoChatMemberRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_member_entity_1 = require("../../domain/entities/chat-member.entity");
const chat_member_schema_1 = require("../database/schemas/chat-member.schema");
let MongoChatMemberRepository = class MongoChatMemberRepository {
    constructor(chatMemberModel) {
        this.chatMemberModel = chatMemberModel;
    }
    async findById(id) {
        const member = await this.chatMemberModel.findById(id).exec();
        return member ? this.toDomain(member) : null;
    }
    async findByChatId(chatId) {
        const members = await this.chatMemberModel
            .find({ chatId, isActive: true })
            .exec();
        return members.map(this.toDomain);
    }
    async findByUserId(userId) {
        const members = await this.chatMemberModel
            .find({ userId, isActive: true })
            .exec();
        return members.map(this.toDomain);
    }
    async findByChatAndUser(chatId, userId) {
        const member = await this.chatMemberModel
            .findOne({ chatId, userId })
            .exec();
        return member ? this.toDomain(member) : null;
    }
    async create(chatMember) {
        const memberDoc = new this.chatMemberModel({
            _id: chatMember.id,
            chatId: chatMember.chatId,
            userId: chatMember.userId,
            role: chatMember.role,
            joinedAt: chatMember.joinedAt,
            isActive: chatMember.isActive,
        });
        const created = await memberDoc.save();
        return this.toDomain(created);
    }
    async update(id, chatMemberData) {
        const updated = await this.chatMemberModel
            .findByIdAndUpdate(id, chatMemberData, { new: true })
            .exec();
        if (!updated) {
            throw new Error('Chat member not found');
        }
        return this.toDomain(updated);
    }
    async delete(id) {
        await this.chatMemberModel.findByIdAndDelete(id).exec();
    }
    async isUserInChat(chatId, userId) {
        const member = await this.chatMemberModel
            .findOne({ chatId, userId, isActive: true })
            .exec();
        return !!member;
    }
    async getChatAdmins(chatId) {
        const admins = await this.chatMemberModel
            .find({ chatId, role: 'admin', isActive: true })
            .exec();
        return admins.map(this.toDomain);
    }
    toDomain(memberDoc) {
        return new chat_member_entity_1.ChatMember(memberDoc._id.toString(), memberDoc.chatId, memberDoc.userId, memberDoc.role, memberDoc.joinedAt, memberDoc.isActive);
    }
};
exports.MongoChatMemberRepository = MongoChatMemberRepository;
exports.MongoChatMemberRepository = MongoChatMemberRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_member_schema_1.ChatMember.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoChatMemberRepository);
//# sourceMappingURL=mongo-chat-member.repository.js.map