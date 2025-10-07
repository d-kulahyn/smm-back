import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ChatMemberRepository, ChatMemberWithUser} from '../../domain/repositories/chat-member.repository';
import {ChatMember} from '../../domain/entities/chat-member.entity';
import {UserRepository} from '../../domain/repositories/user.repository';
import {ChatMember as ChatMemberSchema, ChatMemberDocument} from '../database/schemas/chat-member.schema';

@Injectable()
export class MongoChatMemberRepository implements ChatMemberRepository {
  constructor(
    @InjectModel(ChatMemberSchema.name) private chatMemberModel: Model<ChatMemberDocument>,
    @Inject('USER_REPOSITORY') private userRepository: UserRepository,
  ) {}

  async findById(id: string): Promise<ChatMember | null> {
    const member = await this.chatMemberModel.findById(id).exec();
    return member ? this.toDomain(member) : null;
  }

  async findByChatId(chatId: string): Promise<ChatMember[]> {
    const members = await this.chatMemberModel
      .find({ chatId, isActive: true })
      .exec();
    return members.map(this.toDomain);
  }

  async findByChatIdWithUsers(chatId: string): Promise<ChatMemberWithUser[]> {
    const members = await this.chatMemberModel
      .find({ chatId, isActive: true })
      .exec();

    // Параллельно загружаем данные пользователей для всех участников
      return await Promise.all(
        members.map(async (memberDoc) => {
            const chatMember = this.toDomain(memberDoc);
            const user = await this.userRepository.findById(memberDoc.userId);

            if (!user) {
                throw new Error(`User not found: ${memberDoc.userId}`);
            }

            return {
                ...chatMember,
                user: {id: user.id, name: user.name, email: user.email, avatar: user.avatar}
            } as ChatMemberWithUser;
        })
    );
  }

  async findByUserId(userId: string): Promise<ChatMember[]> {
    const members = await this.chatMemberModel
      .find({ userId, isActive: true })
      .exec();
    return members.map(this.toDomain);
  }

  async findByChatAndUser(chatId: string, userId: string): Promise<ChatMember | null> {
    const member = await this.chatMemberModel
      .findOne({ chatId, userId })
      .exec();
    return member ? this.toDomain(member) : null;
  }

  async create(chatMember: ChatMember): Promise<ChatMember> {
    const memberDoc = new this.chatMemberModel({
      _id: chatMember.id,
      chatId: chatMember.chatId,
      userId: chatMember.userId,
      role: chatMember.role,
      joinedAt: chatMember.joinedAt,
      isActive: chatMember.isActive,
    });

    const created = await memberDoc.save();
    return this.toDomain(created);
  }

  async update(id: string, chatMemberData: Partial<ChatMember>): Promise<ChatMember> {
    const updated = await this.chatMemberModel
      .findByIdAndUpdate(id, chatMemberData, { new: true })
      .exec();

    if (!updated) {
      throw new Error('Chat member not found');
    }

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.chatMemberModel.findByIdAndDelete(id).exec();
  }

  async isUserInChat(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberModel
      .findOne({ chatId, userId, isActive: true })
      .exec();
    return !!member;
  }

  async getChatAdmins(chatId: string): Promise<ChatMember[]> {
    const admins = await this.chatMemberModel
      .find({ chatId, role: 'admin', isActive: true })
      .exec();
    return admins.map(this.toDomain);
  }

  private toDomain(memberDoc: ChatMemberDocument): ChatMember {
    return new ChatMember(
      memberDoc._id.toString(),
      memberDoc.chatId, // Убираем .toString() так как chatId теперь уже строка
      memberDoc.userId,
      memberDoc.role as any,
      memberDoc.joinedAt,
      memberDoc.isActive,
    );
  }
}
