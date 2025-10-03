import { FormattedDate } from '../../shared/formatters/date.formatter';
export declare class ChatResource {
    id: string;
    projectId: string;
    customerId: string;
    title: string;
    description?: string;
    status: string;
    isActive: boolean;
    isArchived: boolean;
    unreadMessagesCount: number;
    members: string[];
    lastMessageAt?: FormattedDate;
    createdAt: FormattedDate;
    updatedAt: FormattedDate;
    constructor(chat: any);
    static fromEntity(chat: any): ChatResource;
    static collection(chats: any[]): ChatResource[];
}
