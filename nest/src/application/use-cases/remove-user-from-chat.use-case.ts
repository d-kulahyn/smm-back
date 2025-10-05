import { Injectable, Inject } from '@nestjs/common';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';

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
  ) {}

  async execute(dto: RemoveUserFromChatDto): Promise<void> {
    // Все проверки безопасности выполняются в ChatPolicy
    // Здесь только бизнес-логика удаления участника
    const memberToRemove = await this.chatMemberRepository.findByChatAndUser(dto.chatId, dto.userId);
    if (memberToRemove) {
      await this.chatMemberRepository.delete(memberToRemove.id);
    }
  }
}
