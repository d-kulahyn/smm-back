import { Injectable, Inject } from '@nestjs/common';
import { ChatMember, ChatMemberRole } from '../../domain/entities/chat-member.entity';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import * as uuid from 'uuid';

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
  ) {}

  async execute(dto: AddUserToChatDto): Promise<ChatMember> {
    // Все проверки безопасности выполняются в ChatPolicy
    // Здесь только бизнес-логика добавления участника
    const chatMember = ChatMember.create({
      id: uuid.v4(),
      chatId: dto.chatId,
      userId: dto.userId,
      role: dto.role || ChatMemberRole.MEMBER,
    });

    return await this.chatMemberRepository.create(chatMember);
  }
}
