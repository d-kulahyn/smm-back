"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = exports.MarkMessagesAsReadDto = exports.AddUserToChatDto = exports.SendMessageDto = exports.CreateChatDto = exports.ErrorResponseDto = exports.MessageDto = exports.ChatCreateResponseDto = exports.MessageCreateResponseDto = exports.MessageListResponseDto = exports.ChatListResponseDto = exports.ChatMemberResponseDto = exports.MessageResponseDto = exports.ChatResponseDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const shared_1 = require("../../../shared");
const create_chat_use_case_1 = require("../../../application/use-cases/create-chat.use-case");
const send_message_use_case_1 = require("../../../application/use-cases/send-message.use-case");
const add_user_to_chat_use_case_1 = require("../../../application/use-cases/add-user-to-chat.use-case");
const remove_user_from_chat_use_case_1 = require("../../../application/use-cases/remove-user-from-chat.use-case");
const mark_messages_as_read_use_case_1 = require("../../../application/use-cases/mark-messages-as-read.use-case");
const shared_2 = require("../../../shared");
const chat_status_enum_1 = require("../../../domain/enums/chat-status.enum");
const message_type_enum_1 = require("../../../domain/enums/message-type.enum");
const chat_member_entity_1 = require("../../../domain/entities/chat-member.entity");
const pagination_params_dto_1 = require("../resources/pagination-params.dto");
const chat_resource_dto_1 = require("../resources/chat-resource.dto");
const message_resource_dto_1 = require("../resources/message-resource.dto");
const chat_member_resource_dto_1 = require("../resources/chat-member-resource.dto");
const shared_3 = require("../../../shared");
const exceptions_1 = require("../../../shared/exceptions");
class ChatResponseDto {
}
exports.ChatResponseDto = ChatResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1abc123def456' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project Discussion' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chat for project coordination', nullable: true }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1project123456' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1creator123456' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Number of unread messages for current user' }),
    __metadata("design:type", Number)
], ChatResponseDto.prototype, "unreadCount", void 0);
class MessageResponseDto {
}
exports.MessageResponseDto = MessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1msg123def456' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello everyone!' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'text' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1chat123456' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "chatId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1sender123456' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'file-path.jpg', nullable: true }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the message is read by current user' }),
    __metadata("design:type", Boolean)
], MessageResponseDto.prototype, "isReadByCurrentUser", void 0);
class ChatMemberResponseDto {
}
exports.ChatMemberResponseDto = ChatMemberResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1member123456' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1chat123456' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "chatId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1user123456' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'member' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "joinedAt", void 0);
class ChatListResponseDto {
}
exports.ChatListResponseDto = ChatListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ChatListResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ChatResponseDto] }),
    __metadata("design:type", Array)
], ChatListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'object',
        properties: {
            total: { type: 'number', example: 5 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 }
        }
    }),
    __metadata("design:type", Object)
], ChatListResponseDto.prototype, "pagination", void 0);
class MessageListResponseDto {
}
exports.MessageListResponseDto = MessageListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], MessageListResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MessageResponseDto] }),
    __metadata("design:type", Array)
], MessageListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'object',
        properties: {
            total: { type: 'number', example: 50 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 }
        }
    }),
    __metadata("design:type", Object)
], MessageListResponseDto.prototype, "pagination", void 0);
class MessageCreateResponseDto {
}
exports.MessageCreateResponseDto = MessageCreateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], MessageCreateResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Message sent successfully' }),
    __metadata("design:type", String)
], MessageCreateResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MessageResponseDto }),
    __metadata("design:type", MessageResponseDto)
], MessageCreateResponseDto.prototype, "data", void 0);
class ChatCreateResponseDto {
}
exports.ChatCreateResponseDto = ChatCreateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ChatCreateResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chat created successfully' }),
    __metadata("design:type", String)
], ChatCreateResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatResponseDto }),
    __metadata("design:type", ChatResponseDto)
], ChatCreateResponseDto.prototype, "data", void 0);
class MessageDto {
}
exports.MessageDto = MessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Operation completed successfully' }),
    __metadata("design:type", String)
], MessageDto.prototype, "message", void 0);
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400 }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bad Request' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Validation failed' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
class CreateChatDto {
}
exports.CreateChatDto = CreateChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Chat name', example: 'Project Discussion' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Chat description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: chat_status_enum_1.ChatStatus, description: 'Chat status', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(chat_status_enum_1.ChatStatus),
    __metadata("design:type", String)
], CreateChatDto.prototype, "status", void 0);
class SendMessageDto {
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message content' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: message_type_enum_1.MessageType, description: 'Message type', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(message_type_enum_1.MessageType),
    __metadata("design:type", String)
], SendMessageDto.prototype, "type", void 0);
class AddUserToChatDto {
}
exports.AddUserToChatDto = AddUserToChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID to add to chat' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddUserToChatDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: chat_member_entity_1.ChatMemberRole, description: 'User role in chat', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(chat_member_entity_1.ChatMemberRole),
    __metadata("design:type", String)
], AddUserToChatDto.prototype, "role", void 0);
class MarkMessagesAsReadDto {
}
exports.MarkMessagesAsReadDto = MarkMessagesAsReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of message IDs to mark as read',
        example: ['clm1msg123def456', 'clm1msg789ghi012'],
        type: [String]
    }),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], MarkMessagesAsReadDto.prototype, "messageIds", void 0);
let ChatController = class ChatController {
    constructor(createChatUseCase, sendMessageUseCase, addUserToChatUseCase, removeUserFromChatUseCase, markMessageAsReadUseCase, markAllMessagesAsReadUseCase, markMultipleMessagesAsReadUseCase, fileService, chatPolicy, chatRepository, messageRepository, chatMemberRepository, userRepository) {
        this.createChatUseCase = createChatUseCase;
        this.sendMessageUseCase = sendMessageUseCase;
        this.addUserToChatUseCase = addUserToChatUseCase;
        this.removeUserFromChatUseCase = removeUserFromChatUseCase;
        this.markMessageAsReadUseCase = markMessageAsReadUseCase;
        this.markAllMessagesAsReadUseCase = markAllMessagesAsReadUseCase;
        this.markMultipleMessagesAsReadUseCase = markMultipleMessagesAsReadUseCase;
        this.fileService = fileService;
        this.chatPolicy = chatPolicy;
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.chatMemberRepository = chatMemberRepository;
        this.userRepository = userRepository;
    }
    async index(projectId, req, page, perPage) {
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!this.chatPolicy.viewAny(user)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to view chats');
        }
        const paginationParams = pagination_params_dto_1.PaginationParamsDto.fromQuery(page, perPage);
        const paginatedResult = await this.chatRepository.findByProjectIdPaginated(projectId, paginationParams.page, paginationParams.perPage);
        const filteredChats = [];
        for (const chat of paginatedResult.data) {
            if (await this.chatPolicy.view(user, chat)) {
                const unreadCount = await this.messageRepository.countUnreadMessages(chat.id, req.user.userId);
                const chatResource = chat_resource_dto_1.ChatResource.fromEntity(chat).withUnreadCount(unreadCount);
                filteredChats.push(chatResource);
            }
        }
        return {
            success: true,
            data: filteredChats,
            pagination: {
                total: paginatedResult.total,
                page: paginatedResult.page,
                limit: paginatedResult.limit
            }
        };
    }
    async store(projectId, createChatDto, req) {
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!this.chatPolicy.create(user)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to create chats');
        }
        const chat = await this.createChatUseCase.execute({
            projectId,
            name: createChatDto.name,
            createdBy: req.user.userId,
            description: createChatDto.description,
        });
        return {
            success: true,
            message: 'Chat created successfully',
            data: chat_resource_dto_1.ChatResource.fromEntity(chat)
        };
    }
    async show(projectId, id, req) {
        const chat = await this.chatRepository.findById(id);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat', id);
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!await this.chatPolicy.view(user, chat)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to view this chat');
        }
        const unreadCount = await this.messageRepository.countUnreadMessages(chat.id, req.user.userId);
        return {
            success: true,
            data: chat_resource_dto_1.ChatResource.fromEntity(chat).withUnreadCount(unreadCount)
        };
    }
    async getMessages(projectId, chatId, req, page, perPage) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!await this.chatPolicy.view(user, chat)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to view this chat');
        }
        const paginationParams = pagination_params_dto_1.PaginationParamsDto.fromQuery(page, perPage);
        const paginatedResult = await this.messageRepository.findByChatId(chatId, paginationParams.page, paginationParams.perPage);
        const messagesWithReadStatus = paginatedResult.data.map(message => message_resource_dto_1.MessageResource.fromEntity(message).withReadStatus(req.user.userId));
        return {
            success: true,
            data: messagesWithReadStatus,
            pagination: {
                total: paginatedResult.total,
                page: paginatedResult.page,
                limit: paginatedResult.limit
            }
        };
    }
    async sendMessage(projectId, chatId, sendMessageDto, req, file) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!await this.chatPolicy.sendMessage(user, chat)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to send messages in this chat');
        }
        let fileUrl;
        let messageType = sendMessageDto.type || message_type_enum_1.MessageType.TEXT;
        if (file) {
            if (file.mimetype.startsWith('image/')) {
                messageType = message_type_enum_1.MessageType.IMAGE;
            }
            else if (file.mimetype.startsWith('audio/')) {
                messageType = message_type_enum_1.MessageType.VOICE;
            }
            else {
                messageType = message_type_enum_1.MessageType.FILE;
            }
            const savedFile = await this.fileService.saveMessageFile(file);
            fileUrl = savedFile.filePath;
        }
        const message = await this.sendMessageUseCase.execute({
            chatId,
            senderId: req.user.userId,
            content: sendMessageDto.content,
            type: messageType,
            fileUrl,
            projectId,
        });
        return {
            success: true,
            message: 'Message sent successfully',
            data: message_resource_dto_1.MessageResource.fromEntity(message).withReadStatus(req.user.userId)
        };
    }
    async addUserToChat(projectId, chatId, addUserDto, req) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!await this.chatPolicy.canAddMembers(chatId, req.user.userId)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to add members to this chat');
        }
        const chatMember = await this.addUserToChatUseCase.execute({
            chatId,
            userId: addUserDto.userId,
            addedBy: req.user.userId,
            role: addUserDto.role,
        });
        return {
            success: true,
            message: 'User added to chat successfully',
            data: chat_member_resource_dto_1.ChatMemberResource.fromEntity(chatMember)
        };
    }
    async removeUserFromChat(projectId, chatId, userId, req) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!await this.chatPolicy.canRemoveMembers(chatId, req.user.userId)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to remove members from this chat');
        }
        await this.removeUserFromChatUseCase.execute({
            chatId,
            userId,
            removedBy: req.user.userId,
        });
        return {
            success: true,
            message: 'User removed from chat successfully'
        };
    }
    async getChatMembers(projectId, chatId, req) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!await this.chatPolicy.view(user, chat)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to view this chat');
        }
        const members = await this.chatMemberRepository.findByChatId(chatId);
        return {
            success: true,
            data: chat_member_resource_dto_1.ChatMemberResource.collection(members)
        };
    }
    async markMessageAsRead(projectId, chatId, messageId, req) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!await this.chatPolicy.view(user, chat)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to access this chat');
        }
        await this.markMessageAsReadUseCase.execute({
            messageId,
            userId: req.user.userId,
        });
        return {
            success: true,
            message: 'Message marked as read'
        };
    }
    async markAllMessagesAsRead(projectId, chatId, req) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!await this.chatPolicy.view(user, chat)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to access this chat');
        }
        await this.markAllMessagesAsReadUseCase.execute({
            chatId,
            userId: req.user.userId,
        });
        return {
            success: true,
            message: 'All messages marked as read'
        };
    }
    async markMultipleMessagesAsRead(projectId, chatId, markMessagesDto, req) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new exceptions_1.ResourceNotFoundException('Chat not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
        }
        if (!await this.chatPolicy.view(user, chat)) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to access this chat');
        }
        await this.markMultipleMessagesAsReadUseCase.execute({
            messageIds: markMessagesDto.messageIds,
            userId: req.user.userId,
        });
        return {
            success: true,
            message: `${markMessagesDto.messageIds.length} messages marked as read`
        };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(),
    (0, shared_1.RequireAnyPermission)(shared_1.Permission.MANAGE_ALL_CHATS, shared_1.Permission.VIEW_PROJECT_CHATS),
    (0, swagger_1.ApiOperation)({
        summary: 'Get project chats',
        description: 'Retrieve paginated list of chats for a specific project'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chats retrieved successfully', type: ChatListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view chats', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('per_page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(),
    (0, shared_1.RequireAnyPermission)(shared_1.Permission.MANAGE_ALL_CHATS, shared_1.Permission.CREATE_CHATS),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new chat',
        description: 'Create a new chat for a specific project'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat created successfully', type: ChatCreateResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to create chats', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateChatDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get chat details',
        description: 'Retrieve detailed chat information'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat details retrieved successfully', type: ChatResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view this chat', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "show", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get chat messages',
        description: 'Retrieve paginated list of messages for a specific chat'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages retrieved successfully', type: MessageListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view this chat', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('per_page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send a message',
        description: 'Send a message to the chat'
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent successfully', type: MessageCreateResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to send messages', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __param(4, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, SendMessageDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, shared_1.RequireAnyPermission)(shared_1.Permission.MANAGE_ALL_CHATS, shared_1.Permission.UPDATE_CHATS),
    (0, swagger_1.ApiOperation)({
        summary: 'Add user to chat',
        description: 'Add a user to the chat with specified role'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User added to chat successfully',
        type: ChatMemberResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to add members', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, AddUserToChatDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "addUserToChat", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, shared_1.RequireAnyPermission)(shared_1.Permission.MANAGE_ALL_CHATS, shared_1.Permission.UPDATE_CHATS),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove user from chat',
        description: 'Remove a user from the chat'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User removed from chat successfully', type: MessageDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to remove members', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "removeUserFromChat", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get chat members',
        description: 'Retrieve list of chat members'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat members retrieved successfully',
        type: [ChatMemberResponseDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view this chat', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatMembers", null);
__decorate([
    (0, common_1.Put)(':id/messages/:messageId/read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark message as read',
        description: 'Mark a specific message as read by the current user'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message marked as read', type: MessageDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to access this chat', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('messageId')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markMessageAsRead", null);
__decorate([
    (0, common_1.Put)(':id/messages/read-all'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark all messages as read',
        description: 'Mark all messages in the chat as read by the current user'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All messages marked as read', type: MessageDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to access this chat', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAllMessagesAsRead", null);
__decorate([
    (0, common_1.Put)(':id/messages/read-multiple'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark multiple messages as read',
        description: 'Mark multiple messages as read by the current user'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages marked as read', type: MessageDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to access this chat', type: ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, MarkMessagesAsReadDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markMultipleMessagesAsRead", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('chats'),
    (0, common_1.Controller)('projects/:projectId/chats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, shared_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(9, (0, common_1.Inject)('CHAT_REPOSITORY')),
    __param(10, (0, common_1.Inject)('MESSAGE_REPOSITORY')),
    __param(11, (0, common_1.Inject)('CHAT_MEMBER_REPOSITORY')),
    __param(12, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [create_chat_use_case_1.CreateChatUseCase,
        send_message_use_case_1.SendMessageUseCase,
        add_user_to_chat_use_case_1.AddUserToChatUseCase,
        remove_user_from_chat_use_case_1.RemoveUserFromChatUseCase,
        mark_messages_as_read_use_case_1.MarkMessageAsReadUseCase,
        mark_messages_as_read_use_case_1.MarkAllMessagesAsReadUseCase,
        mark_messages_as_read_use_case_1.MarkMultipleMessagesAsReadUseCase,
        shared_3.FileService,
        shared_2.ChatPolicy, Object, Object, Object, Object])
], ChatController);
//# sourceMappingURL=chat.controller.js.map