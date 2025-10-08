import { Chat } from '../../../domain/entities/chat.entity';
import { ChatWithExtras } from '../../../domain/repositories/chat.repository';
import { MessageResource } from './message-resource.dto';
export declare class ChatResource {
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
    members?: any;
    constructor(chat: Chat);
    static fromEntity(chat: Chat): ChatResource;
    static collection(chats: Chat[]): ChatResource[];
    static fromEntityWithExtras(chat: ChatWithExtras): ChatResource;
    static collectionWithExtras(chats: ChatWithExtras[]): ChatResource[];
    withMembersCount(count: number): ChatResource;
    withUnreadCount(count: number): ChatResource;
    withLastMessage(lastMessage: MessageResource | null): ChatResource;
}
