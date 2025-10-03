import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { ChatRepository } from '../../domain/repositories/chat.repository';
export interface RemoveUserFromChatDto {
    chatId: string;
    userId: string;
    removedBy: string;
}
export declare class RemoveUserFromChatUseCase {
    private readonly chatMemberRepository;
    private readonly chatRepository;
    constructor(chatMemberRepository: ChatMemberRepository, chatRepository: ChatRepository);
    execute(dto: RemoveUserFromChatDto): Promise<void>;
}
