import { Model } from 'mongoose';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
import { MessageDocument } from '../database/schemas/message.schema';
import { MessageReadDocument } from '../database/schemas/message-read.schema';
export declare class MongoMessageRepository implements MessageRepository {
    private messageModel;
    private messageReadModel;
    constructor(messageModel: Model<MessageDocument>, messageReadModel: Model<MessageReadDocument>);
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
    markMultipleAsRead(messageIds: string[], userId: string): Promise<void>;
    findUnreadMessages(userId: string): Promise<Message[]>;
    countUnreadMessages(chatId: string, userId: string): Promise<number>;
    findByIdIn(ids: string[]): Promise<Message[]>;
    deleteManyByChatId(chatId: string): Promise<void>;
    private toDomain;
    private toDocument;
}
