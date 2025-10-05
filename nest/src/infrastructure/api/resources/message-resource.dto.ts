import { Message } from '../../../domain/entities/message.entity';

export class MessageResource {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: string;
  fileUrl?: string;
  readBy: string[];
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isReadByCurrentUser?: boolean; // Renamed from isRead for clarity

  constructor(message: Message) {
    this.id = message.id;
    this.chatId = message.chatId;
    this.senderId = message.senderId;
    this.content = message.content;
    this.type = message.type;
    this.fileUrl = message.fileUrl;
    this.readBy = message.readBy;
    this.isEdited = message.isEdited;
    this.editedAt = message.editedAt?.toISOString();
    this.isDeleted = message.isDeleted;
    this.createdAt = message.createdAt?.toISOString();
    this.updatedAt = message.updatedAt?.toISOString();
  }

  static fromEntity(message: Message): MessageResource {
    return new MessageResource(message);
  }

  static collection(messages: Message[]): MessageResource[] {
    return messages.map(message => MessageResource.fromEntity(message));
  }

  withReadStatus(userId: string): MessageResource {
    this.isReadByCurrentUser = this.readBy?.includes(userId);
    return this;
  }
}
