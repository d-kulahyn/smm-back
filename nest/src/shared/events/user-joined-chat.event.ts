import { BaseEvent, BroadcastTransport } from './base-event';
import { ChatMember } from '../../domain/entities/chat-member.entity';

export class UserJoinedChatEvent extends BaseEvent {
  constructor(
    private readonly chatMember: ChatMember,
    private readonly chatId: string,
    private readonly userId: string,
    private readonly addedBy: string,
    private readonly projectId: string
  ) {
    super();
  }

  getEventName(): string {
    return 'chat.user.joined';
  }

  getPayload(): Record<string, any> {
    return {
      chatMember: {
        id: this.chatMember.id,
        chatId: this.chatMember.chatId,
        userId: this.chatMember.userId,
        role: this.chatMember.role,
        joinedAt: this.chatMember.joinedAt
      },
      chatId: this.chatId,
      userId: this.userId,
      addedBy: this.addedBy,
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
      `user.${this.addedBy}`
    ];
  }

  getBroadcastTransports(): BroadcastTransport[] {
    return [
      BroadcastTransport.WEBSOCKET,
      BroadcastTransport.REDIS
    ];
  }
}
