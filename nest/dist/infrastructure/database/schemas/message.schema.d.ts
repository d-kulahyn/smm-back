import { Document } from 'mongoose';
export type MessageDocument = Message & Document;
export declare enum MessageType {
    TEXT = "text",
    VOICE = "voice",
    FILE = "file",
    IMAGE = "image"
}
export declare class Message {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    fileUrl?: string;
    readBy: string[];
    isEdited: boolean;
    editedAt?: Date;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message> & Message & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>> & import("mongoose").FlatRecord<Message> & Required<{
    _id: string;
}>>;
