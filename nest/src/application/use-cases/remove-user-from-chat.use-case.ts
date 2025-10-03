import { Injectable, Inject } from '@nestjs/common';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { ChatRepository } from '../../domain/repositories/chat.repository';
import { ChatMemberRole } from '../../domain/entities/chat-member.entity';
import { ResourceNotFoundException, AccessDeniedException, BusinessException } from '../../shared/exceptions';

export interface RemoveUserFromChatDto {
  chatId: string;
  userId: string;
  removedBy: string;
}

@Injectable()
export class RemoveUserFromChatUseCase {
  constructor(
    @Inject('CHAT_MEMBER_REPOSITORY')
    private readonly chatMemberRepository: ChatMemberRepository,
    @Inject('CHAT_REPOSITORY')
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(dto: RemoveUserFromChatDto): Promise<void> {
    // Check if chat exists
    const chat = await this.chatRepository.findById(dto.chatId);
    if (!chat) {
      throw new ResourceNotFoundException('Chat', dto.chatId);
    }

    // Check if user removing has permission (is admin or moderator)
    const removerMember = await this.chatMemberRepository.findByChatAndUser(dto.chatId, dto.removedBy);
    if (!removerMember || (removerMember.role !== ChatMemberRole.ADMIN && removerMember.role !== ChatMemberRole.MODERATOR)) {
      throw new AccessDeniedException('You do not have permission to remove users from this chat');
    }

    // Check if user to remove exists in chat
    const memberToRemove = await this.chatMemberRepository.findByChatAndUser(dto.chatId, dto.userId);
    if (!memberToRemove) {
      throw new BusinessException('User is not a member of this chat', 'USER_NOT_MEMBER');
    }

    // Don't allow removing the chat creator/admin unless remover is also admin
    if (memberToRemove.role === ChatMemberRole.ADMIN && removerMember.role !== ChatMemberRole.ADMIN) {
      throw new AccessDeniedException('You cannot remove an admin from this chat');
    }

    // Don't allow users to remove themselves (they should use leave chat functionality)
    if (dto.userId === dto.removedBy) {
      throw new BusinessException('Use leave chat functionality to remove yourself', 'CANNOT_REMOVE_SELF');
    }

    await this.chatMemberRepository.delete(memberToRemove.id);
  }
}
