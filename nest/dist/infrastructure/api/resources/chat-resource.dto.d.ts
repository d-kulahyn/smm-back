import { Chat } from '../../../domain/entities/chat.entity';
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
    constructor(chat: Chat);
    static fromEntity(chat: Chat): ChatResource;
    static collection(chats: Chat[]): ChatResource[];
    withMembersCount(count: number): ChatResource;
    withUnreadCount(count: number): ChatResource;
}
