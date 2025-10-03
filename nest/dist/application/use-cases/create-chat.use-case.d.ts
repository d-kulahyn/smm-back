import { Chat } from '../../domain/entities/chat.entity';
import { ChatRepository } from '../../domain/repositories/chat.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { EventBroadcastService } from '../../shared/events';
export interface CreateChatDto {
    name: string;
    description?: string;
    createdBy: string;
    isGroup?: boolean;
    avatar?: string;
    members?: string[];
    projectId?: string;
}
export declare class CreateChatUseCase {
    private readonly chatRepository;
    private readonly chatMemberRepository;
    private readonly eventBroadcastService;
    constructor(chatRepository: ChatRepository, chatMemberRepository: ChatMemberRepository, eventBroadcastService: EventBroadcastService);
    execute(dto: CreateChatDto): Promise<Chat>;
}
