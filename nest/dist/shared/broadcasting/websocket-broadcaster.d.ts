import { BaseBroadcaster } from './base-broadcaster';
import { BaseEvent, BroadcastTransport } from '../events/base-event';
export declare class WebSocketBroadcaster extends BaseBroadcaster {
    constructor();
    getTransportType(): BroadcastTransport;
    broadcast(event: BaseEvent, channels: string[], options?: Record<string, any>): Promise<void>;
    broadcastToUser(userId: string, event: BaseEvent, options?: Record<string, any>): Promise<void>;
    broadcastToChannel(channel: string, event: BaseEvent, options?: Record<string, any>): Promise<void>;
}
