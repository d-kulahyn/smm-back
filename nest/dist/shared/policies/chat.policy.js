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
exports.ChatPolicy = void 0;
const common_1 = require("@nestjs/common");
const chat_member_entity_1 = require("../../domain/entities/chat-member.entity");
let ChatPolicy = class ChatPolicy {
    constructor(chatRepository, chatMemberRepository) {
        this.chatRepository = chatRepository;
        this.chatMemberRepository = chatMemberRepository;
    }
    viewAny(user) {
        return !!user;
    }
    async view(user, chat) {
        return await this.canViewChat(chat.id, user.id);
    }
    create(user) {
        return !!user;
    }
    async sendMessage(user, chat) {
        return await this.canSendMessage(chat.id, user.id);
    }
    async canViewChat(chatId, userId) {
        const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
        return member !== null && member.isActive;
    }
    async canSendMessage(chatId, userId) {
        const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
        return member !== null && member.isActive;
    }
    async canAddMembers(chatId, userId) {
        const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
        return member !== null &&
            member.isActive &&
            (member.role === chat_member_entity_1.ChatMemberRole.ADMIN || member.role === chat_member_entity_1.ChatMemberRole.MODERATOR);
    }
    async canRemoveMembers(chatId, userId) {
        const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
        return member !== null &&
            member.isActive &&
            (member.role === chat_member_entity_1.ChatMemberRole.ADMIN || member.role === chat_member_entity_1.ChatMemberRole.MODERATOR);
    }
    async canDeleteChat(chatId, userId) {
        const chat = await this.chatRepository.findById(chatId);
        const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
        return chat !== null &&
            member !== null &&
            member.isActive &&
            (chat.createdBy === userId || member.role === chat_member_entity_1.ChatMemberRole.ADMIN);
    }
    async canUpdateChat(chatId, userId) {
        const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
        return member !== null &&
            member.isActive &&
            (member.role === chat_member_entity_1.ChatMemberRole.ADMIN || member.role === chat_member_entity_1.ChatMemberRole.MODERATOR);
    }
};
exports.ChatPolicy = ChatPolicy;
exports.ChatPolicy = ChatPolicy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CHAT_REPOSITORY')),
    __param(1, (0, common_1.Inject)('CHAT_MEMBER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, Object])
], ChatPolicy);
//# sourceMappingURL=chat.policy.js.map