import { ChatMember } from '../entities/chat-member.entity';
import { User } from '../entities/user.entity';

// Интерфейс для участника чата с данными пользователя
export interface ChatMemberWithUser extends ChatMember {
  user: {id: string, name: string, email: string, avatar?: string};
}

export interface ChatMemberRepository {
  findById(id: string): Promise<ChatMember | null>;
  findByChatId(chatId: string): Promise<ChatMember[]>;
  findByChatIdWithUsers(chatId: string): Promise<ChatMemberWithUser[]>;
  findByUserId(userId: string): Promise<ChatMember[]>;
  findByChatAndUser(chatId: string, userId: string): Promise<ChatMember | null>;
  create(chatMember: ChatMember): Promise<ChatMember>;
  update(id: string, updates: Partial<ChatMember>): Promise<ChatMember>;
  delete(id: string): Promise<void>;
  isUserInChat(chatId: string, userId: string): Promise<boolean>;
}
