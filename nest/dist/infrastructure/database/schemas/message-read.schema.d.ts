import { Document } from 'mongoose';
export type MessageReadDocument = MessageRead & Document;
export declare class MessageRead {
    _id: string;
    messageId: string;
    userId: string;
    readAt: Date;
}
export declare const MessageReadSchema: import("mongoose").Schema<MessageRead, import("mongoose").Model<MessageRead, any, any, any, Document<unknown, any, MessageRead> & MessageRead & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MessageRead, Document<unknown, {}, import("mongoose").FlatRecord<MessageRead>> & import("mongoose").FlatRecord<MessageRead> & Required<{
    _id: string;
}>>;
