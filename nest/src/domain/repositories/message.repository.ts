import { Message } from '../entities/message.entity';
import { MessageType } from '../enums/message-type.enum';

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
  markMultipleAsRead(messageIds: string[], userId: string): Promise<void>;
  findUnreadMessages(userId: string): Promise<Message[]>;
  countUnreadMessages(chatId: string, userId: string): Promise<number>;
  // Additional methods from MongoMessageRepository
  findByIdIn(ids: string[]): Promise<Message[]>;
  deleteManyByChatId(chatId: string): Promise<void>;
  // Add any other missing methods here
}
