import { BaseEvent, BroadcastTransport } from '../events/base-event';
export interface BroadcastChannel {
    name: string;
    users?: string[];
    groups?: string[];
}
export interface BroadcastMessage {
    event: string;
    data: Record<string, any>;
    channels: string[];
    timestamp: Date;
    eventId: string;
}
export declare abstract class BaseBroadcaster {
    abstract getTransportType(): BroadcastTransport;
    abstract broadcast(event: BaseEvent, channels: string[], options?: Record<string, any>): Promise<void>;
    abstract broadcastToUser(userId: string, event: BaseEvent, options?: Record<string, any>): Promise<void>;
    abstract broadcastToChannel(channel: string, event: BaseEvent, options?: Record<string, any>): Promise<void>;
}
