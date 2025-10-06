import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from '../api/controllers/chat.controller';
import { CreateChatUseCase } from '../../application/use-cases/create-chat.use-case';
import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';
import { AddUserToChatUseCase } from '../../application/use-cases/add-user-to-chat.use-case';
import { RemoveUserFromChatUseCase } from '../../application/use-cases/remove-user-from-chat.use-case';
import { MarkMessageAsReadUseCase, MarkAllMessagesAsReadUseCase, MarkMultipleMessagesAsReadUseCase } from '../../application/use-cases/mark-messages-as-read.use-case';
import { MongoChatRepository } from '../repositories/mongo-chat.repository';
import { MongoMessageRepository } from '../repositories/mongo-message.repository';
import { MongoChatMemberRepository } from '../repositories/mongo-chat-member.repository';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { PrismaService } from '../database/prisma.service';
import { FileService } from '../../shared';
import { ChatPolicy } from '../../shared';
import { Chat, ChatSchema } from '../database/schemas/chat.schema';
import { Message, MessageSchema } from '../database/schemas/message.schema';
import { MessageRead, MessageReadSchema } from '../database/schemas/message-read.schema';
import { ChatMember, ChatMemberSchema } from '../database/schemas/chat-member.schema';
import { EventsModule } from '../../shared/events';

export const CHAT_REPOSITORY = 'CHAT_REPOSITORY';
export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';
export const CHAT_MEMBER_REPOSITORY = 'CHAT_MEMBER_REPOSITORY';
export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
      { name: MessageRead.name, schema: MessageReadSchema },
      { name: ChatMember.name, schema: ChatMemberSchema },
    ]),
    EventsModule, // Добавляем импорт модуля событий
  ],
  controllers: [ChatController],
  providers: [
    // Use Cases
    CreateChatUseCase,
    SendMessageUseCase,
    AddUserToChatUseCase,
    RemoveUserFromChatUseCase,
    MarkMessageAsReadUseCase,
    MarkAllMessagesAsReadUseCase,
    MarkMultipleMessagesAsReadUseCase,

    // Services
    PrismaService,
    FileService,
    ChatPolicy,

    // Repositories
    {
      provide: CHAT_REPOSITORY,
      useClass: MongoChatRepository,
    },
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MongoMessageRepository,
    },
    {
      provide: CHAT_MEMBER_REPOSITORY,
      useClass: MongoChatMemberRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [CHAT_REPOSITORY], // Экспортируем CHAT_REPOSITORY для использования в других модулях
})
export class ChatModule {}
