import { Model } from 'mongoose';
import { ChatRepository, ChatWithExtras } from '../../domain/repositories/chat.repository';
import { Chat } from '../../domain/entities/chat.entity';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { ChatDocument as ChatDoc } from '../database/schemas/chat.schema';
export declare class MongoChatRepository implements ChatRepository {
    private chatModel;
    private messageRepository;
    private chatMemberRepository;
    constructor(chatModel: Model<ChatDoc>, messageRepository: MessageRepository, chatMemberRepository: ChatMemberRepository);
    findById(id: string): Promise<Chat | null>;
    findByIdWithExtras(id: string): Promise<ChatWithExtras | null>;
    findByProjectId(projectId: string, userId: string): Promise<Chat[]>;
    findByProjectIds(projectIds: string[]): Promise<Map<string, Chat[]>>;
    findByProjectIdPaginated(projectId: string, page: number, limit: number): Promise<{
        data: Chat[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByUserId(userId: string): Promise<Chat[]>;
    findUserChats(userId: string, page: number, limit: number): Promise<{
        data: Chat[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(chat: Chat): Promise<Chat>;
    update(id: string, chatData: Partial<Chat>): Promise<Chat>;
    delete(id: string): Promise<void>;
    findByProjectIdPaginatedWithExtras(projectId: string, userId: string, page: number, limit: number): Promise<{
        data: ChatWithExtras[];
        total: number;
        page: number;
        limit: number;
    }>;
    getExtraForChat(chats: ChatDoc[], userId: string): Promise<Awaited<ChatWithExtras>[]>;
    findByProjectIdsWithExtras(projectIds: string[], userId: string): Promise<Map<string, ChatWithExtras[]>>;
    private toDomain;
}
