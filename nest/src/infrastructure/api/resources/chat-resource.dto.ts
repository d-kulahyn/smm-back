import { Chat } from '../../../domain/entities/chat.entity';
import { ChatWithExtras } from '../../../domain/repositories/chat.repository';
import { MessageResource } from './message-resource.dto';

export class ChatResource {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: string;
  isActive: boolean;
  creatorId: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  membersCount?: number;
  unreadCount?: number;
  lastMessage?: MessageResource;

  constructor(chat: Chat) {
    this.id = chat.id;
    this.projectId = chat.projectId;
    this.name = chat.name;
    this.description = chat.description;
    this.status = chat.status;
    this.isActive = chat.isActive;
    this.creatorId = chat.creatorId;
    this.lastMessageAt = chat.lastMessageAt?.toISOString();
    this.createdAt = chat.createdAt.toISOString();
    this.updatedAt = chat.updatedAt.toISOString();
  }

  static fromEntity(chat: Chat): ChatResource {
    return new ChatResource(chat);
  }

  static collection(chats: Chat[]): ChatResource[] {
    return chats.map(chat => ChatResource.fromEntity(chat));
  }

  static fromEntityWithExtras(chat: ChatWithExtras): ChatResource {
    const chatResource = new ChatResource(chat);
    chatResource.unreadCount = chat.unreadCount;
    chatResource.lastMessage = chat.lastMessage ? MessageResource.fromEntity(chat.lastMessage) : undefined;
    return chatResource;
  }

  static collectionWithExtras(chats: ChatWithExtras[]): ChatResource[] {
    return chats.map(chat => ChatResource.fromEntityWithExtras(chat));
  }

  withMembersCount(count: number): ChatResource {
    this.membersCount = count;
    return this;
  }

  withUnreadCount(count: number): ChatResource {
    this.unreadCount = count;
    return this;
  }

  withLastMessage(lastMessage: MessageResource | null): ChatResource {
    this.lastMessage = lastMessage || undefined;
    return this;
  }
}
