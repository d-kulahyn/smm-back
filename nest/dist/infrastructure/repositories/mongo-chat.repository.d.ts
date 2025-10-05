import { Model } from 'mongoose';
import { ChatRepository } from '../../domain/repositories/chat.repository';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatDocument as ChatDoc } from '../database/schemas/chat.schema';
export declare class MongoChatRepository implements ChatRepository {
    private chatModel;
    constructor(chatModel: Model<ChatDoc>);
    findById(id: string): Promise<Chat | null>;
    findByProjectId(projectId: string): Promise<Chat[]>;
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
    private toDomain;
}
