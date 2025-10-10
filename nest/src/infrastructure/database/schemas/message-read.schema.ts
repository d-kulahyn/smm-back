import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type MessageReadDocument = MessageRead & Document;

@Schema({
    timestamps: true,
    _id: false // Отключаем автоматический ObjectId
})
export class MessageRead {
    @Prop({required: true, type: String})
    _id: string; // Используем UUID как строку

    @Prop({required: true})
    messageId: string;

    @Prop({required: true})
    userId: string;

    @Prop({required: true, default: () => new Date()})
    readAt: Date;

    @Prop({required: true, default: () => new Date()})
    messageCreatedAt: Date
}

export const MessageReadSchema = SchemaFactory.createForClass(MessageRead);

// Создаем составной индекс для быстрого поиска
MessageReadSchema.index({messageId: 1, userId: 1}, {unique: true});
MessageReadSchema.index({userId: 1});
