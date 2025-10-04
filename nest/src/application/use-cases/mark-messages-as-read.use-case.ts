import { Injectable, Inject } from '@nestjs/common';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { ResourceNotFoundException, AccessDeniedException } from '../../shared/exceptions';

export interface MarkMessageAsReadDto {
  messageId: string;
  userId: string;
}

export interface MarkAllMessagesAsReadDto {
  chatId: string;
  userId: string;
}

export interface MarkMultipleMessagesAsReadDto {
  messageIds: string[];
  userId: string;
}

@Injectable()
export class MarkMessageAsReadUseCase {
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    @Inject('CHAT_MEMBER_REPOSITORY')
    private readonly chatMemberRepository: ChatMemberRepository,
  ) {}

  async execute(dto: MarkMessageAsReadDto): Promise<void> {
    const message = await this.messageRepository.findById(dto.messageId);
    if (!message) {
      throw new ResourceNotFoundException('Message', dto.messageId);
    }

    // Check if user is member of the chat
    const isMember = await this.chatMemberRepository.isUserInChat(message.chatId, dto.userId);
    if (!isMember) {
      throw new AccessDeniedException('You are not a member of this chat');
    }

    await this.messageRepository.markAsRead(dto.messageId, dto.userId);
  }
}

@Injectable()
export class MarkAllMessagesAsReadUseCase {
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    @Inject('CHAT_MEMBER_REPOSITORY')
    private readonly chatMemberRepository: ChatMemberRepository,
  ) {}

  async execute(dto: MarkAllMessagesAsReadDto): Promise<void> {
    // Check if user is member of the chat
    const isMember = await this.chatMemberRepository.isUserInChat(dto.chatId, dto.userId);
    if (!isMember) {
      throw new AccessDeniedException('You are not a member of this chat');
    }

    await this.messageRepository.markAllAsRead(dto.chatId, dto.userId);
  }
}

@Injectable()
export class MarkMultipleMessagesAsReadUseCase {
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    @Inject('CHAT_MEMBER_REPOSITORY')
    private readonly chatMemberRepository: ChatMemberRepository,
  ) {}

  async execute(dto: MarkMultipleMessagesAsReadDto): Promise<void> {
    if (!dto.messageIds || dto.messageIds.length === 0) {
      return;
    }

    const messages = await this.messageRepository.findByIdIn(dto.messageIds);
    if (messages.length === 0) {
      throw new ResourceNotFoundException('Messages not found');
    }

    // Check if user is member of all chats that contain these messages
    const chatIds = [...new Set(messages.map(msg => msg.chatId))];
    for (const chatId of chatIds) {
      const isMember = await this.chatMemberRepository.isUserInChat(chatId, dto.userId);
      if (!isMember) {
        throw new AccessDeniedException(`You are not a member of chat ${chatId}`);
      }
    }

    await this.messageRepository.markMultipleAsRead(dto.messageIds, dto.userId);
  }
}
