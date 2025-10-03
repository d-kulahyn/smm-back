import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRepository } from '../../domain/repositories/chat.repository';
import { Chat } from '../../domain/entities/chat.entity';
import { Chat as ChatDocument, ChatDocument as ChatDoc } from '../database/schemas/chat.schema';

@Injectable()
export class MongoChatRepository implements ChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDoc>,
  ) {}

  async findById(id: string): Promise<Chat | null> {
    const chat = await this.chatModel.findById(id).exec();
    return chat ? this.toDomain(chat) : null;
  }

  async findByProjectId(projectId: string): Promise<Chat[]> {
    const chats = await this.chatModel.find({ projectId }).exec();
    return chats.map(this.toDomain);
  }

  async findByProjectIdPaginated(projectId: string, page: number, limit: number): Promise<{
    data: Chat[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      this.chatModel
        .find({ projectId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.chatModel.countDocuments({ projectId })
    ]);

    return {
      data: chats.map(this.toDomain),
      total,
      page,
      limit,
    };
  }

  async findByUserId(userId: string): Promise<Chat[]> {
    // Найти чаты через участников (потребуется join с коллекцией members)
    const chats = await this.chatModel.find({
      $or: [
        { creatorId: userId },
        { members: userId } // Предполагаем, что есть массив members в схеме
      ]
    }).exec();

    return chats.map(this.toDomain);
  }

  async findUserChats(userId: string, page: number, limit: number): Promise<{
    data: Chat[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { creatorId: userId },
        { members: userId }
      ]
    };

    const [chats, total] = await Promise.all([
      this.chatModel
        .find(filter)
        .sort({ lastMessageAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.chatModel.countDocuments(filter)
    ]);

    return {
      data: chats.map(this.toDomain),
      total,
      page,
      limit,
    };
  }

  async create(chat: Chat): Promise<Chat> {
    const chatDoc = new this.chatModel({
      _id: chat.id,
      projectId: chat.projectId,
      name: chat.name,
      creatorId: chat.creatorId,
      description: chat.description,
      status: chat.status,
      isActive: chat.isActive,
      isGroup: chat.isGroup,
      avatar: chat.avatar,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });

    const created = await chatDoc.save();
    return this.toDomain(created);
  }

  async update(id: string, chatData: Partial<Chat>): Promise<Chat> {
    const updated = await this.chatModel
      .findByIdAndUpdate(id, {
        ...chatData,
        updatedAt: new Date()
      }, { new: true })
      .exec();

    if (!updated) {
      throw new Error('Chat not found');
    }

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.chatModel.findByIdAndDelete(id).exec();
  }

  private toDomain(chatDoc: any): Chat {
    return new Chat(
      chatDoc._id.toString(),
      chatDoc.name,
      chatDoc.createdBy || chatDoc.creatorId,
      chatDoc.createdAt,
      chatDoc.updatedAt,
      chatDoc.isGroup || false,
      chatDoc.description,
      chatDoc.avatar,
      chatDoc.projectId,
      chatDoc.status,
      chatDoc.isActive !== undefined ? chatDoc.isActive : true,
      chatDoc.lastMessageAt
    );
  }
}
