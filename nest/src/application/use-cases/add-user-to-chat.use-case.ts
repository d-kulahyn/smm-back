import { Injectable, Inject } from '@nestjs/common';
import { ChatMember, ChatMemberRole } from '../../domain/entities/chat-member.entity';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { ChatRepository } from '../../domain/repositories/chat.repository';
import { ResourceNotFoundException, AccessDeniedException, BusinessException } from '../../shared/exceptions';
import { v4 as uuidv4 } from 'uuid';

export interface AddUserToChatDto {
  chatId: string;
  userId: string;
  addedBy: string;
  role?: ChatMemberRole;
}

@Injectable()
export class AddUserToChatUseCase {
  constructor(
    @Inject('CHAT_MEMBER_REPOSITORY')
    private readonly chatMemberRepository: ChatMemberRepository,
    @Inject('CHAT_REPOSITORY')
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(dto: AddUserToChatDto): Promise<ChatMember> {
    // Check if chat exists
    const chat = await this.chatRepository.findById(dto.chatId);
    if (!chat) {
      throw new ResourceNotFoundException('Chat', dto.chatId);
    }

    // Check if user adding has permission (is admin or moderator)
    const adderMember = await this.chatMemberRepository.findByChatAndUser(dto.chatId, dto.addedBy);
    if (!adderMember || (adderMember.role !== ChatMemberRole.ADMIN && adderMember.role !== ChatMemberRole.MODERATOR)) {
      throw new AccessDeniedException('You do not have permission to add users to this chat');
    }

    // Check if user is already in chat
    const existingMember = await this.chatMemberRepository.findByChatAndUser(dto.chatId, dto.userId);
    if (existingMember) {
      throw new BusinessException('User is already a member of this chat', 'USER_ALREADY_MEMBER');
    }

    const chatMember = ChatMember.create({
      id: uuidv4(),
      chatId: dto.chatId,
      userId: dto.userId,
      role: dto.role || ChatMemberRole.MEMBER,
    });

    return await this.chatMemberRepository.create(chatMember);
  }
}
