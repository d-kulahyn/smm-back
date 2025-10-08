import { MessageType } from '../enums/message-type.enum';
export declare class Message {
    readonly id: string;
    readonly chatId: string;
    readonly senderId: string;
    readonly content: string;
    readonly type: MessageType;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly fileUrl?: string;
    readonly readBy?: string[];
    readonly isEdited: boolean;
    readonly editedAt?: Date;
    readonly isDeleted: boolean;
    constructor(id: string, chatId: string, senderId: string, content: string, type: MessageType, createdAt?: Date, updatedAt?: Date, fileUrl?: string, readBy?: string[], isEdited?: boolean, editedAt?: Date, isDeleted?: boolean);
    static create(params: {
        id: string;
        chatId: string;
        senderId: string;
        content: string;
        type: MessageType;
        attachments?: string[];
        fileUrl?: string;
        readBy?: string[];
    }): Message;
}
