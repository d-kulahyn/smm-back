import { BaseEvent, BroadcastTransport } from './base-event';
import { Chat } from '../../domain/entities/chat.entity';

export class ChatCreatedEvent extends BaseEvent {
  constructor(
    private readonly chat: Chat,
    private readonly creatorId: string,
    private readonly projectId: string
  ) {
    super();
  }

  getEventName(): string {
    return 'chat.created';
  }

  getPayload(): Record<string, any> {
    return {
      chat: {
        id: this.chat.id,
        name: this.chat.name,
        description: this.chat.description,
        projectId: this.chat.projectId,
        creatorId: this.chat.creatorId,
        isGroup: this.chat.isGroup,
        createdAt: this.chat.createdAt
      },
      creatorId: this.creatorId,
      projectId: this.projectId,
      timestamp: this.timestamp,
      eventId: this.eventId
    };
  }

  getBroadcastChannels(): string[] {
    return [
      `project.${this.projectId}`,
      `user.${this.creatorId}`
    ];
  }

  getBroadcastTransports(): BroadcastTransport[] {
    return [
      BroadcastTransport.WEBSOCKET,
      BroadcastTransport.REDIS
    ];
  }
}
