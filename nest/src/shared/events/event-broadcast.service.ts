import { Injectable } from '@nestjs/common';
import { BaseEvent, BroadcastTransport } from '../events/base-event';
import { BaseBroadcaster } from '../broadcasting/base-broadcaster';
import { WebSocketBroadcaster } from '../broadcasting/websocket-broadcaster';
import { RedisBroadcaster } from '../broadcasting/redis-broadcaster';

@Injectable()
export class EventBroadcastService {
  private broadcasters: Map<BroadcastTransport, BaseBroadcaster> = new Map();

  constructor(
    private readonly webSocketBroadcaster: WebSocketBroadcaster,
    private readonly redisBroadcaster: RedisBroadcaster,
  ) {
    // Регистрируем все доступные броадкастеры
    this.registerBroadcaster(this.webSocketBroadcaster);
    this.registerBroadcaster(this.redisBroadcaster);
  }

  private registerBroadcaster(broadcaster: BaseBroadcaster): void {
    this.broadcasters.set(broadcaster.getTransportType(), broadcaster);
  }

  async broadcast(event: BaseEvent): Promise<void> {
    const channels = event.getBroadcastChannels();
    const transports = event.getBroadcastTransports();

    console.log(`Broadcasting event ${event.getEventName()} to channels:`, channels);
    console.log(`Using transports:`, transports);

    // Отправляем событие через все указанные транспорты
    const broadcastPromises = transports.map(async (transport) => {
      const broadcaster = this.broadcasters.get(transport);

      if (!broadcaster) {
        console.warn(`Broadcaster for transport ${transport} not found`);
        return;
      }

      try {
        await broadcaster.broadcast(event, channels);
        console.log(`Successfully broadcasted via ${transport}`);
      } catch (error) {
        console.error(`Failed to broadcast via ${transport}:`, error);
      }
    });

    await Promise.allSettled(broadcastPromises);
  }

  async broadcastToUser(userId: string, event: BaseEvent): Promise<void> {
    const transports = event.getBroadcastTransports();

    const broadcastPromises = transports.map(async (transport) => {
      const broadcaster = this.broadcasters.get(transport);

      if (!broadcaster) {
        console.warn(`Broadcaster for transport ${transport} not found`);
        return;
      }

      try {
        await broadcaster.broadcastToUser(userId, event);
        console.log(`Successfully broadcasted to user ${userId} via ${transport}`);
      } catch (error) {
        console.error(`Failed to broadcast to user ${userId} via ${transport}:`, error);
      }
    });

    await Promise.allSettled(broadcastPromises);
  }

  async broadcastToChannel(channel: string, event: BaseEvent): Promise<void> {
    const transports = event.getBroadcastTransports();

    const broadcastPromises = transports.map(async (transport) => {
      const broadcaster = this.broadcasters.get(transport);

      if (!broadcaster) {
        console.warn(`Broadcaster for transport ${transport} not found`);
        return;
      }

      try {
        await broadcaster.broadcastToChannel(channel, event);
        console.log(`Successfully broadcasted to channel ${channel} via ${transport}`);
      } catch (error) {
        console.error(`Failed to broadcast to channel ${channel} via ${transport}:`, error);
      }
    });

    await Promise.allSettled(broadcastPromises);
  }
}
