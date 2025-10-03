import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
import { Message as MessageSchema, MessageDocument } from '../database/schemas/message.schema';
import { PaginatedResult } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class MongoMessageRepository implements MessageRepository {
  constructor(
    @InjectModel(MessageSchema.name) private messageModel: Model<MessageDocument>,
  ) {}

  async findById(id: string): Promise<Message | null> {
    const message = await this.messageModel.findById(id).exec();
    return message ? this.toDomain(message) : null;
  }

  async findByChatId(chatId: string, page: number, limit: number): Promise<{
    data: Message[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.messageModel
        .find({ chatId, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.messageModel.countDocuments({ chatId, isDeleted: false })
    ]);

    return {
      data: messages.map(this.toDomain).reverse(), // Возвращаем в хронологическом порядке
      total,
      page,
      limit,
    };
  }

  async create(message: Message): Promise<Message> {
    const messageDoc = new this.messageModel({
      _id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content,
      type: message.type,
      fileUrl: message.fileUrl,
      readBy: message.readBy,
      isEdited: message.isEdited,
      editedAt: message.editedAt,
      isDeleted: message.isDeleted,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    });

    const created = await messageDoc.save();
    return this.toDomain(created);
  }

  async update(id: string, messageData: Partial<Message>): Promise<Message> {
    const updated = await this.messageModel
      .findByIdAndUpdate(id, {
        ...messageData,
        updatedAt: new Date()
      }, { new: true })
      .exec();

    if (!updated) {
      throw new Error('Message not found');
    }

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.messageModel
      .findByIdAndUpdate(id, {
        isDeleted: true,
        updatedAt: new Date()
      })
      .exec();
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    await this.messageModel
      .findByIdAndUpdate(
        messageId,
        {
          $addToSet: { readBy: userId },
          updatedAt: new Date()
        }
      )
      .exec();
  }

  async markAllAsRead(chatId: string, userId: string): Promise<void> {
    await this.messageModel
      .updateMany(
        {
          chatId,
          senderId: { $ne: userId }, // Не отмечаем свои сообщения
          readBy: { $nin: [userId] }, // Только те, что еще не прочитаны
          isDeleted: false
        },
        {
          $addToSet: { readBy: userId },
          updatedAt: new Date()
        }
      )
      .exec();
  }

  async markAllAsReadInChat(chatId: string, userId: string): Promise<void> {
    await this.messageModel
      .updateMany(
        {
          chatId,
          senderId: { $ne: userId }, // Не отмечаем свои сообщения
          readBy: { $nin: [userId] }, // Только те, что еще не прочитаны
          isDeleted: false
        },
        {
          $addToSet: { readBy: userId },
          updatedAt: new Date()
        }
      )
      .exec();
  }

  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    return this.messageModel
      .countDocuments({
        chatId,
        senderId: { $ne: userId }, // Не считаем свои сообщения
        readBy: { $nin: [userId] }, // Не прочитанные пользователем
        isDeleted: false
      })
      .exec();
  }

  async findUnreadMessages(userId: string): Promise<Message[]> {
    const messages = await this.messageModel
      .find({
        senderId: { $ne: userId }, // Не свои сообщения
        readBy: { $nin: [userId] }, // Не прочитанные пользователем
        isDeleted: false
      })
      .sort({ createdAt: -1 })
      .exec();

    return messages.map(this.toDomain);
  }

  async findByIdIn(ids: string[]): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ _id: { $in: ids }, isDeleted: false })
      .exec();

    return messages.map(this.toDomain);
  }

  async deleteManyByChatId(chatId: string): Promise<void> {
    await this.messageModel
      .updateMany(
        { chatId },
        {
          isDeleted: true,
          updatedAt: new Date()
        }
      )
      .exec();
  }

  private toDomain(messageDoc: any): Message {
    return new Message(
      messageDoc._id.toString(),
      messageDoc.chatId, // Убираем .toString() так как chatId теперь уже строка
      messageDoc.senderId,
      messageDoc.content,
      messageDoc.type as any,
      messageDoc.createdAt,
      messageDoc.updatedAt,
      messageDoc.isRead || false,
      messageDoc.readAt,
      messageDoc.attachments || [],
      messageDoc.fileUrl,
      messageDoc.readBy || [],
      messageDoc.isEdited || false,
      messageDoc.editedAt,
      messageDoc.isDeleted || false
    );
  }
}
