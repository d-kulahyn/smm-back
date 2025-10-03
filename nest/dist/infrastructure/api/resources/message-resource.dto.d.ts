import { Message } from '../../../domain/entities/message.entity';
export declare class MessageResource {
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
    isRead?: boolean;
    constructor(message: Message);
    static fromEntity(message: Message): MessageResource;
    static collection(messages: Message[]): MessageResource[];
    withReadStatus(userId: string): MessageResource;
}
