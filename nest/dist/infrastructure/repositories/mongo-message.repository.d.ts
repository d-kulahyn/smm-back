import { Model } from 'mongoose';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
import { MessageDocument } from '../database/schemas/message.schema';
export declare class MongoMessageRepository implements MessageRepository {
    private messageModel;
    constructor(messageModel: Model<MessageDocument>);
    findById(id: string): Promise<Message | null>;
    findByChatId(chatId: string, page: number, limit: number): Promise<{
        data: Message[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(message: Message): Promise<Message>;
    update(id: string, messageData: Partial<Message>): Promise<Message>;
    delete(id: string): Promise<void>;
    markAsRead(messageId: string, userId: string): Promise<void>;
    markAllAsRead(chatId: string, userId: string): Promise<void>;
    markAllAsReadInChat(chatId: string, userId: string): Promise<void>;
    getUnreadCount(chatId: string, userId: string): Promise<number>;
    findUnreadMessages(userId: string): Promise<Message[]>;
    findByIdIn(ids: string[]): Promise<Message[]>;
    deleteManyByChatId(chatId: string): Promise<void>;
    private toDomain;
}
