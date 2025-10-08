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
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const chat_member_entity_1 = require("../../domain/entities/chat-member.entity");
let ChatPolicy = class ChatPolicy {
    constructor(chatRepository, chatMemberRepository, userRepository, prismaService) {
        this.chatRepository = chatRepository;
        this.chatMemberRepository = chatMemberRepository;
        this.userRepository = userRepository;
        this.prismaService = prismaService;
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
    async canRemoveMemberFromChat(chatId, removerId, targetUserId) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            return false;
        }
        const removerMember = await this.chatMemberRepository.findByChatAndUser(chatId, removerId);
        const targetMember = await this.chatMemberRepository.findByChatAndUser(chatId, targetUserId);
        if (!removerMember || !targetMember || !removerMember.isActive) {
            return false;
        }
        if (chat.createdBy === removerId) {
            return true;
        }
        if ((removerMember.role === chat_member_entity_1.ChatMemberRole.ADMIN || removerMember.role === chat_member_entity_1.ChatMemberRole.MODERATOR) &&
            targetMember.role === chat_member_entity_1.ChatMemberRole.MEMBER) {
            return true;
        }
        if (removerMember.role === chat_member_entity_1.ChatMemberRole.ADMIN && targetMember.role === chat_member_entity_1.ChatMemberRole.MODERATOR) {
            return true;
        }
        if (removerId === targetUserId) {
            return true;
        }
        return false;
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
    async canAddMembersToProjectChat(chatId, userId, targetUserId, projectId) {
        const canAdd = await this.canAddMembers(chatId, userId);
        if (!canAdd) {
            return false;
        }
        const isProjectMember = await this.isUserProjectMember(projectId, targetUserId);
        if (!isProjectMember) {
            return false;
        }
        const userExists = await this.userRepository.findById(targetUserId);
        return !!userExists;
    }
    async isUserProjectMember(projectId, userId) {
        const project = await this.prismaService.project.findUnique({
            where: { id: projectId },
            include: {
                members: { where: { userId } }
            }
        });
        return project && (project.ownerId === userId || project.members.length > 0);
    }
    async canCreateChatInProject(userId, projectId) {
        if (!userId) {
            return false;
        }
        return await this.isUserProjectMember(projectId, userId);
    }
    async validateUserForChatAddition(userId, chatId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return { isValid: false, reason: 'User not found' };
        }
        const existingMember = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
        if (existingMember) {
            return { isValid: false, reason: 'User is already a member of this chat' };
        }
        return { isValid: true };
    }
    async validateUserForChatRemoval(userId, chatId) {
        const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
        if (!member) {
            return { isValid: false, reason: 'User is not a member of this chat' };
        }
        return { isValid: true };
    }
};
exports.ChatPolicy = ChatPolicy;
exports.ChatPolicy = ChatPolicy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CHAT_REPOSITORY')),
    __param(1, (0, common_1.Inject)('CHAT_MEMBER_REPOSITORY')),
    __param(2, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, Object, Object, prisma_service_1.PrismaService])
], ChatPolicy);
//# sourceMappingURL=chat.policy.js.map