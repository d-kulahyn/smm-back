import { ChatMember, ChatMemberRole } from '../../domain/entities/chat-member.entity';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
export interface AddUserToChatDto {
    chatId: string;
    userId: string;
    addedBy: string;
    role?: ChatMemberRole;
}
export declare class AddUserToChatUseCase {
    private readonly chatMemberRepository;
    constructor(chatMemberRepository: ChatMemberRepository);
    execute(dto: AddUserToChatDto): Promise<ChatMember>;
}
