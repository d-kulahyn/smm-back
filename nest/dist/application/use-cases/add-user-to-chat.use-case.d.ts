import { ChatMember, ChatMemberRole } from '../../domain/entities/chat-member.entity';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { ChatRepository } from '../../domain/repositories/chat.repository';
export interface AddUserToChatDto {
    chatId: string;
    userId: string;
    addedBy: string;
    role?: ChatMemberRole;
}
export declare class AddUserToChatUseCase {
    private readonly chatMemberRepository;
    private readonly chatRepository;
    constructor(chatMemberRepository: ChatMemberRepository, chatRepository: ChatRepository);
    execute(dto: AddUserToChatDto): Promise<ChatMember>;
}
