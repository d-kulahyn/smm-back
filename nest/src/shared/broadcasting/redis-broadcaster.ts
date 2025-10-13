import { Injectable } from '@nestjs/common';
import { BaseBroadcaster } from './base-broadcaster';
import { BaseEvent, BroadcastTransport } from '../events';
import { RedisService } from '../../infrastructure/services/redis.service';

@Injectable()
export class RedisBroadcaster extends BaseBroadcaster {
  constructor(
    private readonly redisService: RedisService
  ) {
    super();
  }

  getTransportType(): BroadcastTransport {
    return BroadcastTransport.REDIS;
  }

  async broadcast(
    event: BaseEvent,
    channels: string[],
    options?: Record<string, any>
  ): Promise<void> {
    for (const channel of channels) {
      await this.broadcastToChannel(channel, event, options);
    }
  }

  async broadcastToUser(
    userId: string,
    event: BaseEvent,
    options?: Record<string, any>
  ): Promise<void> {
    const userChannel = `user.${userId}`;
    await this.broadcastToChannel(userChannel, event, options);
  }

  async broadcastToChannel(
    channel: string,
    event: BaseEvent,
    options?: Record<string, any>
  ): Promise<void> {
    try {
      const payload = await event.getPayload();

      const streamData: Record<string, string> = {
        event: event.getEventName(),
        channel: channel,
        timestamp: event.timestamp.toISOString(),
        eventId: event.eventId,
        payload: JSON.stringify(payload),
        transport: this.getTransportType(),
        ...options
      };

      const messageId = await this.redisService.addToStream(
          channel,
        streamData,
        {
          maxLen: 10000
        }
      );

      console.log(`Redis Stream: Event '${event.getEventName()}' added to stream '${channel}' with ID: ${messageId}`);

    } catch (error) {
      console.error(`Failed to broadcast event to Redis Stream for channel ${channel}:`, error);
      throw error;
    }
  }
}
