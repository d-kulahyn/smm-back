import { BaseEvent, BroadcastTransport } from './base-event';
import { ChatMember } from '../../domain/entities/chat-member.entity';
export declare class UserJoinedChatEvent extends BaseEvent {
    private readonly chatMember;
    private readonly chatId;
    private readonly userId;
    private readonly addedBy;
    private readonly projectId;
    constructor(chatMember: ChatMember, chatId: string, userId: string, addedBy: string, projectId: string);
    getEventName(): string;
    getPayload(): Record<string, any>;
    getBroadcastChannels(): string[];
    getBroadcastTransports(): BroadcastTransport[];
}
