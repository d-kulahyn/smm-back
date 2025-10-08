import { Message } from '../entities/message.entity';
export interface MessageRepository {
    findById(id: string): Promise<Message | null>;
    findByChatId(chatId: string, createdAt?: string, sort?: 'asc' | 'desc', per_page?: number): Promise<{
        data: Message[];
        total: number;
    }>;
    create(message: Message): Promise<Message>;
    update(id: string, updates: Partial<Message>): Promise<Message>;
    delete(id: string): Promise<void>;
    markAsRead(messageId: string, userId: string): Promise<void>;
    markAllAsRead(chatId: string, userId: string): Promise<void>;
    markMultipleAsRead(messageIds: string[], userId: string): Promise<void>;
    findUnreadMessages(userId: string): Promise<Message[]>;
    countUnreadMessages(chatId: string, userId: string): Promise<number>;
    findByIdIn(ids: string[]): Promise<Message[]>;
    deleteManyByChatId(chatId: string): Promise<void>;
    findLastMessageByChatId(chatId: string): Promise<Message | null>;
}
