import { Chat } from '../entities/chat.entity';

export interface ChatRepository {
  findById(id: string): Promise<Chat | null>;
  findByUserId(userId: string): Promise<Chat[]>;
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
}
