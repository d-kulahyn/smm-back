import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
export interface RemoveUserFromChatDto {
    chatId: string;
    userId: string;
    removedBy: string;
}
export declare class RemoveUserFromChatUseCase {
    private readonly chatMemberRepository;
    constructor(chatMemberRepository: ChatMemberRepository);
    execute(dto: RemoveUserFromChatDto): Promise<void>;
}
