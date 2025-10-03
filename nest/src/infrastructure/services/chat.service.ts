import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../database/schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {}

  async findByProjectId(projectId: string): Promise<any[]> {
    const chats = await this.chatModel.find({ projectId }).exec();
    return chats.map(chat => ({
      id: chat._id.toString(),
      name: chat.name,
      description: chat.description,
      members: chat.members,
      isActive: chat.isActive,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));
  }

  async findByProjectIds(projectIds: string[]): Promise<Map<string, any[]>> {
    const chats = await this.chatModel.find({
      projectId: { $in: projectIds }
    }).exec();

    const chatsMap = new Map<string, any[]>();

    projectIds.forEach(id => chatsMap.set(id, []));

    chats.forEach(chat => {
      const projectId = chat.projectId;
      const existingChats = chatsMap.get(projectId) || [];
      existingChats.push({
        id: chat._id.toString(),
        name: chat.name,
        description: chat.description,
        members: chat.members,
        isActive: chat.isActive,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      });
      chatsMap.set(projectId, existingChats);
    });

    return chatsMap;
  }
}
