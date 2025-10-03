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
exports.AddUserToChatUseCase = void 0;
const common_1 = require("@nestjs/common");
const chat_member_entity_1 = require("../../domain/entities/chat-member.entity");
const exceptions_1 = require("../../shared/exceptions");
const uuid_1 = require("uuid");
let AddUserToChatUseCase = class AddUserToChatUseCase {
    constructor(chatMemberRepository, chatRepository) {
        this.chatMemberRepository = chatMemberRepository;
        this.chatRepository = chatRepository;
    }
    async execute(dto) {
        const chat = await this.chatRepository.findById(dto.chatId);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat', dto.chatId);
        }
        const adderMember = await this.chatMemberRepository.findByChatAndUser(dto.chatId, dto.addedBy);
        if (!adderMember || (adderMember.role !== chat_member_entity_1.ChatMemberRole.ADMIN && adderMember.role !== chat_member_entity_1.ChatMemberRole.MODERATOR)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to add users to this chat');
        }
        const existingMember = await this.chatMemberRepository.findByChatAndUser(dto.chatId, dto.userId);
        if (existingMember) {
            throw new exceptions_1.BusinessException('User is already a member of this chat', 'USER_ALREADY_MEMBER');
        }
        const chatMember = chat_member_entity_1.ChatMember.create({
            id: (0, uuid_1.v4)(),
            chatId: dto.chatId,
            userId: dto.userId,
            role: dto.role || chat_member_entity_1.ChatMemberRole.MEMBER,
        });
        return await this.chatMemberRepository.create(chatMember);
    }
};
exports.AddUserToChatUseCase = AddUserToChatUseCase;
exports.AddUserToChatUseCase = AddUserToChatUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CHAT_MEMBER_REPOSITORY')),
    __param(1, (0, common_1.Inject)('CHAT_REPOSITORY')),
    __metadata("design:paramtypes", [Object, Object])
], AddUserToChatUseCase);
//# sourceMappingURL=add-user-to-chat.use-case.js.map