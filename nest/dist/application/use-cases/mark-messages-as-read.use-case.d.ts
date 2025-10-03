import { MessageRepository } from '../../domain/repositories/message.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
export interface MarkMessageAsReadDto {
    messageId: string;
    userId: string;
}
export interface MarkAllMessagesAsReadDto {
    chatId: string;
    userId: string;
}
export declare class MarkMessageAsReadUseCase {
    private readonly messageRepository;
    private readonly chatMemberRepository;
    constructor(messageRepository: MessageRepository, chatMemberRepository: ChatMemberRepository);
    execute(dto: MarkMessageAsReadDto): Promise<void>;
}
export declare class MarkAllMessagesAsReadUseCase {
    private readonly messageRepository;
    private readonly chatMemberRepository;
    constructor(messageRepository: MessageRepository, chatMemberRepository: ChatMemberRepository);
    execute(dto: MarkAllMessagesAsReadDto): Promise<void>;
}
