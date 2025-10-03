import { ChatMember } from '../entities/chat-member.entity';

export interface ChatMemberRepository {
  findById(id: string): Promise<ChatMember | null>;
  findByChatId(chatId: string): Promise<ChatMember[]>;
  findByUserId(userId: string): Promise<ChatMember[]>;
  findByChatAndUser(chatId: string, userId: string): Promise<ChatMember | null>;
  create(chatMember: ChatMember): Promise<ChatMember>;
  update(id: string, updates: Partial<ChatMember>): Promise<ChatMember>;
  delete(id: string): Promise<void>;
  isUserInChat(chatId: string, userId: string): Promise<boolean>;
}
