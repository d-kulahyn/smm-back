import { BaseBroadcaster } from './base-broadcaster';
import { BaseEvent, BroadcastTransport } from '../events';
import { RedisService } from '../../infrastructure/services/redis.service';
export declare class RedisBroadcaster extends BaseBroadcaster {
    private readonly redisService;
    constructor(redisService: RedisService);
    getTransportType(): BroadcastTransport;
    broadcast(event: BaseEvent, channels: string[], options?: Record<string, any>): Promise<void>;
    broadcastToUser(userId: string, event: BaseEvent, options?: Record<string, any>): Promise<void>;
    broadcastToChannel(channel: string, event: BaseEvent, options?: Record<string, any>): Promise<void>;
}
