import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

export enum MessageType {
  TEXT = 'text',
  VOICE = 'voice',
  FILE = 'file',
  IMAGE = 'image',
}

@Schema({
  timestamps: true,
  _id: false // Отключаем автоматический ObjectId
})
export class Message {
  @Prop({ required: true, type: String })
  _id: string; // Используем UUID как строку

  @Prop({ required: true })
  chatId: string; // Изменено с ObjectId на string для UUID

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Prop()
  fileUrl?: string;

  @Prop({ type: [String], default: [] })
  readBy: string[];

  @Prop({ default: false })
  isEdited: boolean;

  @Prop()
  editedAt?: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Устанавливаем _id как primary key
MessageSchema.set('_id', true);
