import { Document } from 'mongoose';
export type ChatMemberDocument = ChatMember & Document;
export declare class ChatMember {
    _id: string;
    chatId: string;
    userId: string;
    role: string;
    joinedAt: Date;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ChatMemberSchema: import("mongoose").Schema<ChatMember, import("mongoose").Model<ChatMember, any, any, any, Document<unknown, any, ChatMember> & ChatMember & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatMember, Document<unknown, {}, import("mongoose").FlatRecord<ChatMember>> & import("mongoose").FlatRecord<ChatMember> & Required<{
    _id: string;
}>>;
