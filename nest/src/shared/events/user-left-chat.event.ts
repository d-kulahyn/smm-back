import { BaseEvent, BroadcastTransport } from './base-event';

export class UserLeftChatEvent extends BaseEvent {
  constructor(
    private readonly chatId: string,
    private readonly userId: string,
    private readonly removedBy: string,
    private readonly projectId: string
  ) {
    super();
  }

  getEventName(): string {
    return 'chat.user.left';
  }

  getPayload(): Record<string, any> {
    return {
      chatId: this.chatId,
      userId: this.userId,
      removedBy: this.removedBy,
      projectId: this.projectId,
      timestamp: this.timestamp,
      eventId: this.eventId
    };
  }

  getBroadcastChannels(): string[] {
    return [
      `project.${this.projectId}`,
      `chat.${this.chatId}`,
      `user.${this.userId}`,
      `user.${this.removedBy}`
    ];
  }

  getBroadcastTransports(): BroadcastTransport[] {
    return [
      BroadcastTransport.WEBSOCKET,
      BroadcastTransport.REDIS
    ];
  }
}
