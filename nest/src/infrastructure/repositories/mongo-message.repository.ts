import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
import { MessageType } from '../../domain/enums/message-type.enum';
import { Message as MessageSchema, MessageDocument } from '../database/schemas/message.schema';
import { MessageRead as MessageReadSchema, MessageReadDocument } from '../database/schemas/message-read.schema';

@Injectable()
export class MongoMessageRepository implements MessageRepository {
  constructor(
    @InjectModel(MessageSchema.name) private messageModel: Model<MessageDocument>,
    @InjectModel(MessageReadSchema.name) private messageReadModel: Model<MessageReadDocument>,
  ) {}

  async findById(id: string): Promise<Message | null> {
    const message = await this.messageModel.findById(id).exec();
    return message ? this.toDomain(message) : null;
  }

  async findByChatId(chatId: string, createdAt?: string, sort?: 'asc' | 'desc'): Promise<{
    data: Message[];
    total: number;
  }> {
    const [messages, total] = await Promise.all([
      this.messageModel
        .find({ chatId, createdAt:  sort === 'asc' && createdAt ? { $gt: new Date(createdAt) } : sort === 'desc' && createdAt ? { $lt: new Date(createdAt) } : {} })
        .sort({ createdAt: -1 })
        .exec(),
      this.messageModel.countDocuments({ chatId })
    ]);

    return {
      data: messages.map(this.toDomain),
      total,
    };
  }

  async create(message: Message): Promise<Message> {
    const createdMessage = new this.messageModel(this.toDocument(message));
    const savedMessage = await createdMessage.save();
    return this.toDomain(savedMessage);
  }

  async update(id: string, updates: Partial<Message>): Promise<Message> {
    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
    return this.toDomain(updatedMessage);
  }

  async delete(id: string): Promise<void> {
    await this.messageModel.findByIdAndDelete(id).exec();
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    await this.messageReadModel.findOneAndUpdate(
      { messageId, userId },
      { messageId, userId, readAt: new Date() },
      { upsert: true }
    ).exec();
  }

  async markAllAsRead(chatId: string, userId: string): Promise<void> {
    const messages = await this.messageModel.find({ chatId }).select('_id').exec();
    const messageIds = messages.map(msg => msg._id.toString());

    if (messageIds.length > 0) {
      await this.markMultipleAsRead(messageIds, userId);
    }
  }

  async markMultipleAsRead(messageIds: string[], userId: string): Promise<void> {
    const operations = messageIds.map(messageId => ({
      updateOne: {
        filter: { messageId, userId },
        update: { messageId, userId, readAt: new Date() },
        upsert: true
      }
    }));

    if (operations.length > 0) {
      await this.messageReadModel.bulkWrite(operations);
    }
  }

  async findUnreadMessages(userId: string): Promise<Message[]> {
    const readMessageIds = await this.messageReadModel
      .find({ userId })
      .select('messageId')
      .exec();

    const readIds = readMessageIds.map(read => read.messageId);

    const messages = await this.messageModel
      .find({
        senderId: { $ne: userId },
        _id: { $nin: readIds }
      })
      .exec();

    return messages.map(this.toDomain);
  }

  async countUnreadMessages(chatId: string, userId: string): Promise<number> {
    const readMessageIds = await this.messageReadModel
      .find({ userId })
      .select('messageId')
      .exec();

    const readIds = readMessageIds.map(read => read.messageId);

    return this.messageModel.countDocuments({
        chatId,
        senderId: {$ne: userId},
        _id: {$nin: readIds}
    });
  }

  async findByIdIn(ids: string[]): Promise<Message[]> {
    const messages = await this.messageModel.find({ _id: { $in: ids } }).exec();
    return messages.map(this.toDomain);
  }

  async deleteManyByChatId(chatId: string): Promise<void> {
    await this.messageModel.deleteMany({ chatId }).exec();
  }

  async findLastMessageByChatId(chatId: string): Promise<Message | null> {
    const message = await this.messageModel
      .findOne({ chatId })
      .sort({ createdAt: -1 })
      .exec();

    return message ? this.toDomain(message) : null;
  }

  private toDomain(doc: any): Message {
    return new Message(
      doc._id.toString(),
      doc.chatId,
      doc.senderId,
      doc.content,
      doc.type || MessageType.TEXT,
      doc.fileUrl || null,
      doc.createdAt,
      doc.updatedAt
    );
  }

  private toDocument(message: Message): any {
    return {
      _id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content,
      type: message.type,
      fileUrl: message.fileUrl,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };
  }
}
