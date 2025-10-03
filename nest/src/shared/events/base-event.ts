export abstract class BaseEvent {
  public readonly timestamp: Date;
  public readonly eventId: string;

  constructor() {
    this.timestamp = new Date();
    this.eventId = this.generateEventId();
  }

  abstract getEventName(): string;
  abstract getPayload(): Record<string, any>;

  // Определяем на какие каналы/транспорты должно отправляться событие
  abstract getBroadcastChannels(): string[];

  // Определяем какие транспорты использовать (websocket, redis, etc.)
  abstract getBroadcastTransports(): BroadcastTransport[];

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export enum BroadcastTransport {
  WEBSOCKET = 'websocket',
  REDIS = 'redis',
  SSE = 'sse', // Server-Sent Events
  WEBHOOK = 'webhook',
  PUSHER = 'pusher',
  SOCKET_IO = 'socket_io'
}
