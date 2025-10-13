import { BaseEvent, BroadcastTransport } from './base-event';
import { Message } from '../../domain/entities/message.entity';
import { MessageResource } from "../../infrastructure/api/resources/message-resource.dto";
import { MessageRepository } from '../../domain/repositories/message.repository';
import { UserRepository } from '../../domain/repositories/user.repository';

export class ChatMessageSentEvent extends BaseEvent {
  constructor(
    private readonly message: Message,
    private readonly chatId: string,
    private readonly senderId: string,
    private readonly projectId: string,
    private readonly chatMembers: string[],
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  getEventName(): string {
    return 'chat.message.sent';
  }

  async getPayload(): Promise<Record<string, any>> {
    return MessageResource.fromEntity((await this.messageRepository.findById(this.message.id)))
        .withReadStatus(this.senderId)
        .withSender(await this.userRepository.findById(this.senderId));
  }

  getBroadcastChannels(): string[] {
    const memberChannels = this.chatMembers.map(userId => `socket.projects.${this.projectId}.${userId}`);

    return [...memberChannels];
  }

  getBroadcastTransports(): BroadcastTransport[] {
    return [
      BroadcastTransport.REDIS
    ];
  }
}
