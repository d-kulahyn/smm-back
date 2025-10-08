import { ChatRepository } from '../../domain/repositories/chat.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class ChatPolicy {
    private readonly chatRepository;
    private readonly chatMemberRepository;
    private readonly userRepository;
    private readonly prismaService;
    constructor(chatRepository: ChatRepository, chatMemberRepository: ChatMemberRepository, userRepository: UserRepository, prismaService: PrismaService);
    viewAny(user: any): boolean;
    view(user: any, chat: any): Promise<boolean>;
    create(user: any): boolean;
    sendMessage(user: any, chat: any): Promise<boolean>;
    canViewChat(chatId: string, userId: string): Promise<boolean>;
    canSendMessage(chatId: string, userId: string): Promise<boolean>;
    canAddMembers(chatId: string, userId: string): Promise<boolean>;
    canRemoveMembers(chatId: string, userId: string): Promise<boolean>;
    canRemoveMemberFromChat(chatId: string, removerId: string, targetUserId: string): Promise<boolean>;
    canDeleteChat(chatId: string, userId: string): Promise<boolean>;
    canUpdateChat(chatId: string, userId: string): Promise<boolean>;
    canAddMembersToProjectChat(chatId: string, userId: string, targetUserId: string, projectId: string): Promise<boolean>;
    isUserProjectMember(projectId: string, userId: string): Promise<boolean>;
    canCreateChatInProject(userId: string, projectId: string): Promise<boolean>;
    validateUserForChatAddition(userId: string, chatId: string): Promise<{
        isValid: boolean;
        reason?: string;
    }>;
    validateUserForChatRemoval(userId: string, chatId: string): Promise<{
        isValid: boolean;
        reason?: string;
    }>;
}
