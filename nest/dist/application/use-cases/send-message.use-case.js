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
exports.SendMessageUseCase = void 0;
const common_1 = require("@nestjs/common");
const message_entity_1 = require("../../domain/entities/message.entity");
const exceptions_1 = require("../../shared/exceptions");
const events_1 = require("../../shared/events");
const events_2 = require("../../shared/events");
const uuid_1 = require("uuid");
let SendMessageUseCase = class SendMessageUseCase {
    constructor(messageRepository, chatMemberRepository, eventBroadcastService) {
        this.messageRepository = messageRepository;
        this.chatMemberRepository = chatMemberRepository;
        this.eventBroadcastService = eventBroadcastService;
    }
    async execute(dto) {
        if (!dto.content || dto.content.trim().length === 0) {
            throw new exceptions_1.BusinessException('Message content cannot be empty', 'MESSAGE_CONTENT_REQUIRED');
        }
        if (dto.content.length > 5000) {
            throw new exceptions_1.BusinessException('Message content cannot exceed 5000 characters', 'MESSAGE_CONTENT_TOO_LONG');
        }
        const isMember = await this.chatMemberRepository.isUserInChat(dto.chatId, dto.senderId);
        if (!isMember) {
            throw new exceptions_1.AccessDeniedException('You are not a member of this chat');
        }
        const message = message_entity_1.Message.create({
            id: (0, uuid_1.v4)(),
            chatId: dto.chatId,
            senderId: dto.senderId,
            content: dto.content.trim(),
            type: dto.type,
            attachments: dto.attachments,
            fileUrl: dto.fileUrl,
        });
        const createdMessage = await this.messageRepository.create(message);
        if (dto.projectId) {
            const allChatMembers = await this.chatMemberRepository.findByChatId(dto.chatId);
            const chatMembers = allChatMembers
                .filter(member => member.userId !== dto.senderId && member.isActive)
                .map(member => member.userId);
            const event = new events_2.ChatMessageSentEvent(createdMessage, dto.chatId, dto.senderId, dto.projectId, chatMembers);
            this.eventBroadcastService.broadcast(event).catch(error => {
                console.error('Failed to broadcast ChatMessageSent event:', error);
            });
        }
        return createdMessage;
    }
};
exports.SendMessageUseCase = SendMessageUseCase;
exports.SendMessageUseCase = SendMessageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MESSAGE_REPOSITORY')),
    __param(1, (0, common_1.Inject)('CHAT_MEMBER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, Object, events_1.EventBroadcastService])
], SendMessageUseCase);
//# sourceMappingURL=send-message.use-case.js.map