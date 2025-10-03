import { BaseEvent } from '../events/base-event';
import { WebSocketBroadcaster } from '../broadcasting/websocket-broadcaster';
import { RedisBroadcaster } from '../broadcasting/redis-broadcaster';
export declare class EventBroadcastService {
    private readonly webSocketBroadcaster;
    private readonly redisBroadcaster;
    private broadcasters;
    constructor(webSocketBroadcaster: WebSocketBroadcaster, redisBroadcaster: RedisBroadcaster);
    private registerBroadcaster;
    broadcast(event: BaseEvent): Promise<void>;
    broadcastToUser(userId: string, event: BaseEvent): Promise<void>;
    broadcastToChannel(channel: string, event: BaseEvent): Promise<void>;
}
