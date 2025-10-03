import { Injectable, Inject } from '@nestjs/common';
import { ChatRepository } from '../../domain/repositories/chat.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { ChatMemberRole } from '../../domain/entities/chat-member.entity';

@Injectable()
export class ChatPolicy {
  constructor(
    @Inject('CHAT_REPOSITORY')
    private readonly chatRepository: ChatRepository,
    @Inject('CHAT_MEMBER_REPOSITORY')
    private readonly chatMemberRepository: ChatMemberRepository,
  ) {}

  viewAny(user: any): boolean {
    return !!user; // User must be authenticated
  }

  async view(user: any, chat: any): Promise<boolean> {
    return await this.canViewChat(chat.id, user.id);
  }

  create(user: any): boolean {
    return !!user; // Any authenticated user can create a chat
  }

  async sendMessage(user: any, chat: any): Promise<boolean> {
    return await this.canSendMessage(chat.id, user.id);
  }

  async canViewChat(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null && member.isActive;
  }

  async canSendMessage(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null && member.isActive;
  }

  async canAddMembers(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null &&
           member.isActive &&
           (member.role === ChatMemberRole.ADMIN || member.role === ChatMemberRole.MODERATOR);
  }

  async canRemoveMembers(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null &&
           member.isActive &&
           (member.role === ChatMemberRole.ADMIN || member.role === ChatMemberRole.MODERATOR);
  }

  async canDeleteChat(chatId: string, userId: string): Promise<boolean> {
    const chat = await this.chatRepository.findById(chatId);
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);

    return chat !== null &&
           member !== null &&
           member.isActive &&
           (chat.createdBy === userId || member.role === ChatMemberRole.ADMIN);
  }

  async canUpdateChat(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null &&
           member.isActive &&
           (member.role === ChatMemberRole.ADMIN || member.role === ChatMemberRole.MODERATOR);
  }
}
