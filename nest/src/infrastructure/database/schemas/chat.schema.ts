import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({
  timestamps: true,
  _id: false // Отключаем автоматический ObjectId
})
export class Chat {
  @Prop({ required: true, type: String })
  _id: string; // Используем UUID как строку

  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  creatorId: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ type: [String], default: [] })
  members: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isGroup: boolean;

  @Prop()
  avatar?: string;

  @Prop()
  lastMessageAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

// Устанавливаем _id как primary key
ChatSchema.set('_id', true);
