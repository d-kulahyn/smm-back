import { BaseEvent, BroadcastTransport } from './base-event';
import { Message } from '../../domain/entities/message.entity';

export class ChatMessageSentEvent extends BaseEvent {
  constructor(
    private readonly message: Message,
    private readonly chatId: string,
    private readonly senderId: string,
    private readonly projectId: string,
    private readonly chatMembers: string[] // Добавляю массив UUID участников чата (кроме отправителя)
  ) {
    super();
  }

  getEventName(): string {
    return 'chat.message.sent';
  }

  getPayload(): Record<string, any> {
    return {
      message: {
        id: this.message.id,
        chatId: this.message.chatId,
        senderId: this.message.senderId,
        content: this.message.content,
        type: this.message.type,
        fileUrl: this.message.fileUrl,
        createdAt: this.message.createdAt,
        isEdited: this.message.isEdited,
        readBy: this.message.readBy
      },
      chatId: this.chatId,
      senderId: this.senderId,
      projectId: this.projectId,
      chatMembers: this.chatMembers, // Добавляю участников в payload
      timestamp: this.timestamp,
      eventId: this.eventId
    };
  }

  getBroadcastChannels(): string[] {
    const memberChannels = this.chatMembers.map(userId => `socket.chats.${this.chatId}.${userId}`);

    return [...memberChannels];
  }

  getBroadcastTransports(): BroadcastTransport[] {
    return [
      BroadcastTransport.REDIS
    ];
  }
}
