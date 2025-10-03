import { BaseEvent, BroadcastTransport } from './base-event';
export declare class UserLeftChatEvent extends BaseEvent {
    private readonly chatId;
    private readonly userId;
    private readonly removedBy;
    private readonly projectId;
    constructor(chatId: string, userId: string, removedBy: string, projectId: string);
    getEventName(): string;
    getPayload(): Record<string, any>;
    getBroadcastChannels(): string[];
    getBroadcastTransports(): BroadcastTransport[];
}
