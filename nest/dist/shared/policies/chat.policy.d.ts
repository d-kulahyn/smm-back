import { ChatRepository } from '../../domain/repositories/chat.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
export declare class ChatPolicy {
    private readonly chatRepository;
    private readonly chatMemberRepository;
    constructor(chatRepository: ChatRepository, chatMemberRepository: ChatMemberRepository);
    viewAny(user: any): boolean;
    view(user: any, chat: any): Promise<boolean>;
    create(user: any): boolean;
    sendMessage(user: any, chat: any): Promise<boolean>;
    canViewChat(chatId: string, userId: string): Promise<boolean>;
    canSendMessage(chatId: string, userId: string): Promise<boolean>;
    canAddMembers(chatId: string, userId: string): Promise<boolean>;
    canRemoveMembers(chatId: string, userId: string): Promise<boolean>;
    canDeleteChat(chatId: string, userId: string): Promise<boolean>;
    canUpdateChat(chatId: string, userId: string): Promise<boolean>;
}
