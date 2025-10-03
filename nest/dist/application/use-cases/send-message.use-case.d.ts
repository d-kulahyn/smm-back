import { Message } from '../../domain/entities/message.entity';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { MessageType } from '../../domain/enums/message-type.enum';
import { EventBroadcastService } from '../../shared/events';
export interface SendMessageDto {
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    attachments?: string[];
    fileUrl?: string;
    projectId?: string;
}
export declare class SendMessageUseCase {
    private readonly messageRepository;
    private readonly chatMemberRepository;
    private readonly eventBroadcastService;
    constructor(messageRepository: MessageRepository, chatMemberRepository: ChatMemberRepository, eventBroadcastService: EventBroadcastService);
    execute(dto: SendMessageDto): Promise<Message>;
}
