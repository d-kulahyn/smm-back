import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
    timestamps: true,
    _id: false // Отключаем автоматический ObjectId
})
export class Message {
    @Prop({required: true, type: String})
    _id: string; // Используем UUID как строку

    @Prop({required: true})
    chatId: string;

    @Prop({required: true})
    senderId: string;

    @Prop({required: true})
    content: string;

    @Prop({required: true, default: 'text'})
    type: string;

    @Prop()
    fileUrl?: string;

    @Prop({required: true, default: () => new Date()})
    createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Создаем индексы для быстрого поиска
MessageSchema.index({chatId: 1, createdAt: -1});
MessageSchema.index({senderId: 1});
