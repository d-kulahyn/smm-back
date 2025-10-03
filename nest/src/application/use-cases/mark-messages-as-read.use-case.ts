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
