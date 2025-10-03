import { AuthenticatedRequest } from '../../../shared';
import { CreateChatUseCase } from '../../../application/use-cases/create-chat.use-case';
import { SendMessageUseCase } from '../../../application/use-cases/send-message.use-case';
import { AddUserToChatUseCase } from '../../../application/use-cases/add-user-to-chat.use-case';
import { RemoveUserFromChatUseCase } from '../../../application/use-cases/remove-user-from-chat.use-case';
import { MarkMessageAsReadUseCase, MarkAllMessagesAsReadUseCase } from '../../../application/use-cases/mark-messages-as-read.use-case';
import { ChatRepository } from '../../../domain/repositories/chat.repository';
import { MessageRepository } from '../../../domain/repositories/message.repository';
import { ChatMemberRepository } from '../../../domain/repositories/chat-member.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { ChatPolicy } from '../../../shared';
import { ChatStatus } from '../../../domain/enums/chat-status.enum';
import { MessageType } from '../../../domain/enums/message-type.enum';
import { ChatMemberRole } from '../../../domain/entities/chat-member.entity';
import { ChatResource } from '../resources/chat-resource.dto';
import { MessageResource } from '../resources/message-resource.dto';
import { ChatMemberResource } from '../resources/chat-member-resource.dto';
import { FileService } from '../../../shared';
export declare class CreateChatDto {
    name: string;
    description?: string;
    status?: ChatStatus;
}
export declare class SendMessageDto {
    content: string;
    type?: MessageType;
}
export declare class AddUserToChatDto {
    userId: string;
    role?: ChatMemberRole;
}
export declare class ChatController {
    private readonly createChatUseCase;
    private readonly sendMessageUseCase;
    private readonly addUserToChatUseCase;
    private readonly removeUserFromChatUseCase;
    private readonly markMessageAsReadUseCase;
    private readonly markAllMessagesAsReadUseCase;
    private readonly fileService;
    private readonly chatPolicy;
    private readonly chatRepository;
    private readonly messageRepository;
    private readonly chatMemberRepository;
    private readonly userRepository;
    constructor(createChatUseCase: CreateChatUseCase, sendMessageUseCase: SendMessageUseCase, addUserToChatUseCase: AddUserToChatUseCase, removeUserFromChatUseCase: RemoveUserFromChatUseCase, markMessageAsReadUseCase: MarkMessageAsReadUseCase, markAllMessagesAsReadUseCase: MarkAllMessagesAsReadUseCase, fileService: FileService, chatPolicy: ChatPolicy, chatRepository: ChatRepository, messageRepository: MessageRepository, chatMemberRepository: ChatMemberRepository, userRepository: UserRepository);
    index(projectId: string, req: AuthenticatedRequest, page?: string, perPage?: string): Promise<{
        success: boolean;
        data: ChatResource[];
        pagination: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    store(projectId: string, createChatDto: CreateChatDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: ChatResource;
    }>;
    show(projectId: string, id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: ChatResource;
    }>;
    getMessages(projectId: string, chatId: string, req: AuthenticatedRequest, page?: string, perPage?: string): Promise<{
        success: boolean;
        data: MessageResource[];
        pagination: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    sendMessage(projectId: string, chatId: string, sendMessageDto: SendMessageDto, req: AuthenticatedRequest, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: MessageResource;
    }>;
    addUserToChat(projectId: string, chatId: string, addUserDto: AddUserToChatDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: ChatMemberResource;
    }>;
    removeUserFromChat(projectId: string, chatId: string, userId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    getChatMembers(projectId: string, chatId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: ChatMemberResource[];
    }>;
    markMessageAsRead(projectId: string, chatId: string, messageId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllMessagesAsRead(projectId: string, chatId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
