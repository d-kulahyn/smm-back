import { Injectable } from '@nestjs/common';
import { BaseBroadcaster } from './base-broadcaster';
import { BaseEvent, BroadcastTransport } from '../events/base-event';

@Injectable()
export class WebSocketBroadcaster extends BaseBroadcaster {
  // Здесь будет инжектиться WebSocket Gateway
  constructor(
    // @Inject('WEBSOCKET_GATEWAY') private readonly wsGateway: WebSocketGateway
  ) {
    super();
  }

  getTransportType(): BroadcastTransport {
    return BroadcastTransport.WEBSOCKET;
  }

  async broadcast(
    event: BaseEvent,
    channels: string[],
    options?: Record<string, any>
  ): Promise<void> {
    const message = {
      event: event.getEventName(),
      data: await event.getPayload(),
      channels,
      timestamp: event.timestamp,
      eventId: event.eventId
    };

    // Отправляем через WebSocket на все каналы
    for (const channel of channels) {
      await this.broadcastToChannel(channel, event, options);
    }
  }

  async broadcastToUser(
    userId: string,
    event: BaseEvent,
    options?: Record<string, any>
  ): Promise<void> {
    // Реализация отправки конкретному пользователю через WebSocket
    console.log(`Broadcasting to user ${userId}:`, event.getEventName());

    // TODO: Интеграция с WebSocket Gateway
    // this.wsGateway.sendToUser(userId, event.getEventName(), event.getPayload());
  }

  async broadcastToChannel(
    channel: string,
    event: BaseEvent,
    options?: Record<string, any>
  ): Promise<void> {
    // Реализация отправки в канал через WebSocket
    console.log(`Broadcasting to channel ${channel}:`, event.getEventName());

    // TODO: Интеграция с WebSocket Gateway
    // this.wsGateway.sendToRoom(channel, event.getEventName(), event.getPayload());
  }
}
