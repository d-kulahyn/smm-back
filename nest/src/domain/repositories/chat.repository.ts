import {Chat} from '../entities/chat.entity';
import {Message} from '../entities/message.entity';
import {ChatMemberWithUser} from './chat-member.repository';

// Интерфейс для чата с дополнительными данными
export interface ChatWithExtras extends Chat {
    unreadCount: number;
    lastMessage: Message | null;
    chatMembers: ChatMemberWithUser[];
}

export interface ChatRepository {
    findById(id: string): Promise<Chat | null>;

    findByIdWithExtras(id: string, userId: string): Promise<ChatWithExtras | null>;

    findByUserId(userId: string): Promise<Chat[]>;

    findByProjectId(projectId: string, userId: string): Promise<Chat[]>;

    findByProjectIds(projectIds: string[]): Promise<Map<string, Chat[]>>;

    findByProjectIdsWithExtras(projectIds: string[], userId: string): Promise<Map<string, ChatWithExtras[]>>;

    create(chat: Chat): Promise<Chat>;

    update(id: string, updates: Partial<Chat>): Promise<Chat>;

    delete(id: string): Promise<void>;

    findUserChats(userId: string, page: number, limit: number): Promise<{
        data: Chat[];
        total: number;
        page: number;
        limit: number;
    }>;

    findByProjectIdPaginated(projectId: string, page: number, limit: number): Promise<{
        data: Chat[];
        total: number;
        page: number;
        limit: number;
    }>;

    findByProjectIdPaginatedWithExtras(projectId: string, userId: string, page: number, limit: number): Promise<{
        data: ChatWithExtras[];
        total: number;
        page: number;
        limit: number;
    }>;
}
