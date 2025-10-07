import { MessageType } from '../enums/message-type.enum';

export class Message {
  constructor(
    public readonly id: string,
    public readonly chatId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly type: MessageType,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly fileUrl?: string,
    public readonly readBy?: string[],
    public readonly isEdited: boolean = false,
    public readonly editedAt?: Date,
    public readonly isDeleted: boolean = false
  ) {}

  static create(params: {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    attachments?: string[];
    fileUrl?: string;
    readBy?: string[];
  }): Message {
    return new Message(
      params.id,
      params.chatId,
      params.senderId,
      params.content,
      params.type,
      new Date(),
      new Date(),
      null,
      params.readBy || [],
      false,
    );
  }
}
