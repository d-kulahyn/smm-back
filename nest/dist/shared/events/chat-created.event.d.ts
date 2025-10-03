import { BaseEvent, BroadcastTransport } from './base-event';
import { Chat } from '../../domain/entities/chat.entity';
export declare class ChatCreatedEvent extends BaseEvent {
    private readonly chat;
    private readonly creatorId;
    private readonly projectId;
    constructor(chat: Chat, creatorId: string, projectId: string);
    getEventName(): string;
    getPayload(): Record<string, any>;
    getBroadcastChannels(): string[];
    getBroadcastTransports(): BroadcastTransport[];
}
