import { Document } from 'mongoose';
export type ChatDocument = Chat & Document;
export declare class Chat {
    _id: string;
    projectId: string;
    name: string;
    description?: string;
    creatorId: string;
    status: string;
    members: string[];
    isActive: boolean;
    isGroup: boolean;
    avatar?: string;
    lastMessageAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ChatSchema: import("mongoose").Schema<Chat, import("mongoose").Model<Chat, any, any, any, Document<unknown, any, Chat> & Chat & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chat, Document<unknown, {}, import("mongoose").FlatRecord<Chat>> & import("mongoose").FlatRecord<Chat> & Required<{
    _id: string;
}>>;
