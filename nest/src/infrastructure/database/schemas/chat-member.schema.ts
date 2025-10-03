import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMemberDocument = ChatMember & Document;

@Schema({
  timestamps: true,
  _id: false // Отключаем автоматический ObjectId
})
export class ChatMember {
  @Prop({ required: true, type: String })
  _id: string; // Используем UUID как строку

  @Prop({ required: true })
  chatId: string; // Изменено с ObjectId на string для UUID

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ['admin', 'member'], default: 'member' })
  role: string;

  @Prop({ default: Date.now })
  joinedAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ChatMemberSchema = SchemaFactory.createForClass(ChatMember);

// Устанавливаем _id как primary key
ChatMemberSchema.set('_id', true);
