import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ChatRepository, ChatWithExtras} from '../../domain/repositories/chat.repository';
import {Chat} from '../../domain/entities/chat.entity';
import {MessageRepository} from '../../domain/repositories/message.repository';
import {ChatMemberRepository} from '../../domain/repositories/chat-member.repository';
import {ChatDocument as ChatDoc} from '../database/schemas/chat.schema';

@Injectable()
export class MongoChatRepository implements ChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDoc>,
    @Inject('MESSAGE_REPOSITORY') private messageRepository: MessageRepository,
    @Inject('CHAT_MEMBER_REPOSITORY') private chatMemberRepository: ChatMemberRepository,
  ) {}

  async findById(id: string): Promise<Chat | null> {
    const chat = await this.chatModel.findById(id).exec();
    return chat ? this.toDomain(chat) : null;
  }

    async findByIdWithExtras(id: string, userId: string): Promise<ChatWithExtras | null> {
        const chat = await this.chatModel.findById(id).exec();

        return chat ? (await this.getExtraForChat([chat], userId)).pop() : null;
    }

  async findByProjectId(projectId: string, userId: string): Promise<Chat[]> {
    const chats = await this.chatModel.find({ projectId }).exec();

      return await this.getExtraForChat(chats, userId);
  }

  async findByProjectIds(projectIds: string[]): Promise<Map<string, Chat[]>> {
    const chats = await this.chatModel.find({
      projectId: { $in: projectIds }
    }).exec();

    const chatsMap = new Map<string, Chat[]>();

    // Инициализируем карту пустыми массивами для каждого проекта
    projectIds.forEach(id => chatsMap.set(id, []));

    // Группируем чаты по projectId
    chats.forEach(chatDoc => {
      const chat = this.toDomain(chatDoc);
      const projectId = chat.projectId;
      const existingChats = chatsMap.get(projectId) || [];
      existingChats.push(chat);
      chatsMap.set(projectId, existingChats);
    });

    return chatsMap;
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

  async findByProjectIdPaginatedWithExtras(projectId: string, userId: string, page: number, limit: number): Promise<{
    data: ChatWithExtras[];
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

    // Получаем дополнительные данные для каждого чата
    const chatsWithExtras: ChatWithExtras[] = await this.getExtraForChat(chats, userId);

    return {
      data: chatsWithExtras,
      total,
      page,
      limit,
    };
  }

  async getExtraForChat(chats: ChatDoc[], userId: string): Promise<Awaited<ChatWithExtras>[]> {
      return await Promise.all(
          chats.map(async (chatDoc) => {
              const chat = this.toDomain(chatDoc);

              // Параллельно получаем количество непрочитанных сообщений, последнее сообщение и участников чата
              const [unreadCount, lastMessage, chatMembers] = await Promise.all([
                  this.messageRepository.countUnreadMessages(chat.id, userId),
                  this.messageRepository.findLastMessageByChatId(chat.id),
                  this.chatMemberRepository.findByChatIdWithUsers(chat.id)
              ]);

              // Создаем объект с дополнительными данными
              return {
                  ...chat,
                  unreadCount,
                  lastMessage,
                  chatMembers
              } as ChatWithExtras;
          })
      );
  }

  async findByProjectIdsWithExtras(projectIds: string[], userId: string): Promise<Map<string, ChatWithExtras[]>> {
    const chats = await this.chatModel.find({
      projectId: { $in: projectIds }
    }).exec();

    const chatsMap = new Map<string, ChatWithExtras[]>();

    // Инициализируем карту пустыми массивами для каждого проекта
    projectIds.forEach(id => chatsMap.set(id, []));

    // Получаем дополнительные данные для каждого чата
    const chatsWithExtras = await Promise.all(
      chats.map(async (chatDoc) => {
        const chat = this.toDomain(chatDoc);

        // Параллельно получаем количество непрочитанных сообщений, последнее сообщение и участников чата
        const [unreadCount, lastMessage, chatMembers] = await Promise.all([
          this.messageRepository.countUnreadMessages(chat.id, userId),
          this.messageRepository.findLastMessageByChatId(chat.id),
          this.chatMemberRepository.findByChatIdWithUsers(chat.id)
        ]);

        return {
          ...chat,
          unreadCount,
          lastMessage,
          chatMembers
        } as ChatWithExtras;
      })
    );

    // Группируем чаты с дополнительными данными по projectId
    chatsWithExtras.forEach(chatWithExtras => {
      const projectId = chatWithExtras.projectId;
      const existingChats = chatsMap.get(projectId) || [];
      existingChats.push(chatWithExtras);
      chatsMap.set(projectId, existingChats);
    });

    return chatsMap;
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
