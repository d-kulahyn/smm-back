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
exports.MarkMultipleMessagesAsReadUseCase = exports.MarkAllMessagesAsReadUseCase = exports.MarkMessageAsReadUseCase = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../../shared/exceptions");
let MarkMessageAsReadUseCase = class MarkMessageAsReadUseCase {
    constructor(messageRepository, chatMemberRepository) {
        this.messageRepository = messageRepository;
        this.chatMemberRepository = chatMemberRepository;
    }
    async execute(dto) {
        const message = await this.messageRepository.findById(dto.messageId);
        if (!message) {
            throw new exceptions_1.ResourceNotFoundException('Message', dto.messageId);
        }
        const isMember = await this.chatMemberRepository.isUserInChat(message.chatId, dto.userId);
        if (!isMember) {
            throw new exceptions_1.AccessDeniedException('You are not a member of this chat');
        }
        await this.messageRepository.markAsRead(dto.messageId, dto.userId);
    }
};
exports.MarkMessageAsReadUseCase = MarkMessageAsReadUseCase;
exports.MarkMessageAsReadUseCase = MarkMessageAsReadUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MESSAGE_REPOSITORY')),
    __param(1, (0, common_1.Inject)('CHAT_MEMBER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, Object])
], MarkMessageAsReadUseCase);
let MarkAllMessagesAsReadUseCase = class MarkAllMessagesAsReadUseCase {
    constructor(messageRepository, chatMemberRepository) {
        this.messageRepository = messageRepository;
        this.chatMemberRepository = chatMemberRepository;
    }
    async execute(dto) {
        const isMember = await this.chatMemberRepository.isUserInChat(dto.chatId, dto.userId);
        if (!isMember) {
            throw new exceptions_1.AccessDeniedException('You are not a member of this chat');
        }
        await this.messageRepository.markAllAsRead(dto.chatId, dto.userId);
    }
};
exports.MarkAllMessagesAsReadUseCase = MarkAllMessagesAsReadUseCase;
exports.MarkAllMessagesAsReadUseCase = MarkAllMessagesAsReadUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MESSAGE_REPOSITORY')),
    __param(1, (0, common_1.Inject)('CHAT_MEMBER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, Object])
], MarkAllMessagesAsReadUseCase);
let MarkMultipleMessagesAsReadUseCase = class MarkMultipleMessagesAsReadUseCase {
    constructor(messageRepository, chatMemberRepository) {
        this.messageRepository = messageRepository;
        this.chatMemberRepository = chatMemberRepository;
    }
    async execute(dto) {
        if (!dto.messageIds || dto.messageIds.length === 0) {
            return;
        }
        const messages = await this.messageRepository.findByIdIn(dto.messageIds);
        if (messages.length === 0) {
            throw new exceptions_1.ResourceNotFoundException('Messages not found');
        }
        const chatIds = [...new Set(messages.map(msg => msg.chatId))];
        for (const chatId of chatIds) {
            const isMember = await this.chatMemberRepository.isUserInChat(chatId, dto.userId);
            if (!isMember) {
                throw new exceptions_1.AccessDeniedException(`You are not a member of chat ${chatId}`);
            }
        }
        await this.messageRepository.markMultipleAsRead(dto.messageIds, dto.userId);
    }
};
exports.MarkMultipleMessagesAsReadUseCase = MarkMultipleMessagesAsReadUseCase;
exports.MarkMultipleMessagesAsReadUseCase = MarkMultipleMessagesAsReadUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MESSAGE_REPOSITORY')),
    __param(1, (0, common_1.Inject)('CHAT_MEMBER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, Object])
], MarkMultipleMessagesAsReadUseCase);
//# sourceMappingURL=mark-messages-as-read.use-case.js.map