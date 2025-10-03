import { Message } from '../entities/message.entity';
export interface MessageRepository {
    findById(id: string): Promise<Message | null>;
    findByChatId(chatId: string, page: number, limit: number): Promise<{
        data: Message[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(message: Message): Promise<Message>;
    update(id: string, updates: Partial<Message>): Promise<Message>;
    delete(id: string): Promise<void>;
    markAsRead(messageId: string, userId: string): Promise<void>;
    markAllAsRead(chatId: string, userId: string): Promise<void>;
    findUnreadMessages(userId: string): Promise<Message[]>;
    findByIdIn(ids: string[]): Promise<Message[]>;
    deleteManyByChatId(chatId: string): Promise<void>;
}
