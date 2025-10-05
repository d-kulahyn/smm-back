import { Injectable, Inject } from '@nestjs/common';
import { ChatRepository } from '../../domain/repositories/chat.repository';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ChatMemberRole } from '../../domain/entities/chat-member.entity';

@Injectable()
export class ChatPolicy {
  constructor(
    @Inject('CHAT_REPOSITORY')
    private readonly chatRepository: ChatRepository,
    @Inject('CHAT_MEMBER_REPOSITORY')
    private readonly chatMemberRepository: ChatMemberRepository,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    private readonly prismaService: PrismaService,
  ) {}

  viewAny(user: any): boolean {
    return !!user; // User must be authenticated
  }

  async view(user: any, chat: any): Promise<boolean> {
    return await this.canViewChat(chat.id, user.id);
  }

  create(user: any): boolean {
    return !!user; // Any authenticated user can create a chat
  }

  async sendMessage(user: any, chat: any): Promise<boolean> {
    return await this.canSendMessage(chat.id, user.id);
  }

  async canViewChat(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null && member.isActive;
  }

  async canSendMessage(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null && member.isActive;
  }

  async canAddMembers(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null &&
           member.isActive &&
           (member.role === ChatMemberRole.ADMIN || member.role === ChatMemberRole.MODERATOR);
  }

  async canRemoveMembers(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null &&
           member.isActive &&
           (member.role === ChatMemberRole.ADMIN || member.role === ChatMemberRole.MODERATOR);
  }

  // Расширенный метод для удаления пользователей с дополнительными проверками
  async canRemoveMemberFromChat(chatId: string, removerId: string, targetUserId: string): Promise<boolean> {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      return false;
    }

    const removerMember = await this.chatMemberRepository.findByChatAndUser(chatId, removerId);
    const targetMember = await this.chatMemberRepository.findByChatAndUser(chatId, targetUserId);

    // Проверяем, что оба пользователя являются участниками чата
    if (!removerMember || !targetMember || !removerMember.isActive) {
      return false;
    }

    // Создатель чата может удалять любых участников
    if (chat.createdBy === removerId) {
      return true;
    }

    // Админы и модераторы могут удалять обычных участников
    if ((removerMember.role === ChatMemberRole.ADMIN || removerMember.role === ChatMemberRole.MODERATOR) &&
        targetMember.role === ChatMemberRole.MEMBER) {
      return true;
    }

    // Админы могут удалять модераторов
    if (removerMember.role === ChatMemberRole.ADMIN && targetMember.role === ChatMemberRole.MODERATOR) {
      return true;
    }

    // Пользователь может удалить себя из чата (покинуть чат)
    if (removerId === targetUserId) {
      return true;
    }

    return false;
  }

  async canDeleteChat(chatId: string, userId: string): Promise<boolean> {
    const chat = await this.chatRepository.findById(chatId);
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);

    return chat !== null &&
           member !== null &&
           member.isActive &&
           (chat.createdBy === userId || member.role === ChatMemberRole.ADMIN);
  }

  async canUpdateChat(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    return member !== null &&
           member.isActive &&
           (member.role === ChatMemberRole.ADMIN || member.role === ChatMemberRole.MODERATOR);
  }

  // Новый метод для проверки, может ли пользователь добавлять участников с проверкой проекта
  async canAddMembersToProjectChat(chatId: string, userId: string, targetUserId: string, projectId: string): Promise<boolean> {
    // Проверяем базовые права на добавление участников
    const canAdd = await this.canAddMembers(chatId, userId);
    if (!canAdd) {
      return false;
    }

    // Проверяем, что добавляемый пользователь является участником проекта
    const isProjectMember = await this.isUserProjectMember(projectId, targetUserId);
    if (!isProjectMember) {
      return false;
    }

    // Проверяем, что пользователь существует
    const userExists = await this.userRepository.findById(targetUserId);
    return !!userExists;
  }

  // Метод для проверки участия в проекте
  async isUserProjectMember(projectId: string, userId: string): Promise<boolean> {
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      include: {
        members: { where: { userId } }
      }
    });

    return project && (project.ownerId === userId || project.members.length > 0);
  }

  // Расширенная проверка для создания чата в проекте
  async canCreateChatInProject(userId: string, projectId: string): Promise<boolean> {
    // Базовая проверка аутентификации
    if (!userId) {
      return false;
    }

    // Проверяем, что пользователь является участником проекта
    return await this.isUserProjectMember(projectId, userId);
  }

  // Метод для проверки существования и доступности пользователя для добавления в чат
  async validateUserForChatAddition(userId: string, chatId: string): Promise<{ isValid: boolean; reason?: string }> {
    // Проверяем существование пользователя
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { isValid: false, reason: 'User not found' };
    }

    // Проверяем, что пользователь не является уже участником чата
    const existingMember = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    if (existingMember) {
      return { isValid: false, reason: 'User is already a member of this chat' };
    }

    return { isValid: true };
  }

  // Метод для проверки существования пользователя для удаления из чата
  async validateUserForChatRemoval(userId: string, chatId: string): Promise<{ isValid: boolean; reason?: string }> {
    // Проверяем, что пользователь является участником чата
    const member = await this.chatMemberRepository.findByChatAndUser(chatId, userId);
    if (!member) {
      return { isValid: false, reason: 'User is not a member of this chat' };
    }

    return { isValid: true };
  }
}
