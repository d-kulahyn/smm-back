import { Injectable, Inject } from '@nestjs/common';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatMember, ChatMemberRole } from '../../domain/entities/chat-member.entity';
import { ChatRepository } from '../../domain/repositories/chat.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { BusinessException } from '../../shared/exceptions';
import { EventBroadcastService } from '../../shared/events';
import * as uuid from 'uuid';

export interface CreateChatDto {
  name: string;
  description?: string;
  createdBy: string;
  isGroup?: boolean;
  avatar?: string;
  members?: string[];
  projectId?: string;
}

@Injectable()
export class CreateChatUseCase {
  constructor(
    @Inject('CHAT_REPOSITORY')
    private readonly chatRepository: ChatRepository,
    @Inject('CHAT_MEMBER_REPOSITORY')
    private readonly chatMemberRepository: ChatMemberRepository,
    private readonly eventBroadcastService: EventBroadcastService,
  ) {}

  async execute(dto: CreateChatDto): Promise<Chat> {
    // Валидация входных данных (не связанная с безопасностью)
    if (!dto.name || dto.name.trim().length === 0) {
      throw new BusinessException('Chat name is required', 'CHAT_NAME_REQUIRED');
    }

    if (dto.name.length > 100) {
      throw new BusinessException('Chat name cannot exceed 100 characters', 'CHAT_NAME_TOO_LONG');
    }

    if (!dto.projectId) {
      throw new BusinessException('Project ID is required', 'PROJECT_ID_REQUIRED');
    }

    // Все проверки безопасности и участия в проекте выполняются в ChatPolicy
    // Здесь только бизнес-логика создания чата
    const chatId = uuid.v4();

    const chat = Chat.create({
      id: chatId,
      projectId: dto.projectId,
      name: dto.name.trim(),
      description: dto.description?.trim(),
      createdBy: dto.createdBy,
      isGroup: dto.isGroup || false,
      avatar: dto.avatar,
    });

    const createdChat = await this.chatRepository.create(chat);

    // Add creator as admin
    const creatorMember = ChatMember.create({
      id: uuid.v4(),
      chatId: chatId,
      userId: dto.createdBy,
      role: ChatMemberRole.ADMIN,
    });

    await this.chatMemberRepository.create(creatorMember);

    // Add other members if provided
    if (dto.members && dto.members.length > 0) {
      for (const memberId of dto.members) {
        if (memberId !== dto.createdBy) {
          const member = ChatMember.create({
            id: uuid.v4(),
            chatId: chatId,
            userId: memberId,
            role: ChatMemberRole.MEMBER,
          });
          await this.chatMemberRepository.create(member);
        }
      }
    }

    // // Отправляем событие создания чата
    // const event = new ChatCreatedEvent(
    //   createdChat,
    //   dto.createdBy,
    //   dto.projectId
    // );
    //
    // // Асинхронно отправляем событие
    // this.eventBroadcastService.broadcast(event).catch(error => {
    //   console.error('Failed to broadcast ChatCreated event:', error);
    // });

    return createdChat;
  }
}
