import { BaseEvent, BroadcastTransport } from './base-event';
import { Message } from '../../domain/entities/message.entity';
export declare class ChatMessageSentEvent extends BaseEvent {
    private readonly message;
    private readonly chatId;
    private readonly senderId;
    private readonly projectId;
    private readonly chatMembers;
    constructor(message: Message, chatId: string, senderId: string, projectId: string, chatMembers: string[]);
    getEventName(): string;
    getPayload(): Record<string, any>;
    getBroadcastChannels(): string[];
    getBroadcastTransports(): BroadcastTransport[];
}
