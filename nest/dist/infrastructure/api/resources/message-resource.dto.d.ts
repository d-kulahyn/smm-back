import { Message } from '../../../domain/entities/message.entity';
import { User } from '../../../domain/entities/user.entity';
export declare class MessageSenderResource {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    constructor(user: User);
    static fromEntity(user: User): MessageSenderResource;
}
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
    isReadByCurrentUser?: boolean;
    sender?: MessageSenderResource;
    constructor(message: Message);
    static fromEntity(message: Message): MessageResource;
    static collection(messages: Message[]): MessageResource[];
    withReadStatus(userId: string): MessageResource;
    withSender(user: User | null): MessageResource;
}
