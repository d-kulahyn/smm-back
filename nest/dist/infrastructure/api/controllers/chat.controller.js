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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const shared_1 = require("../../../shared");
const create_chat_use_case_1 = require("../../../application/use-cases/create-chat.use-case");
const send_message_use_case_1 = require("../../../application/use-cases/send-message.use-case");
const add_user_to_chat_use_case_1 = require("../../../application/use-cases/add-user-to-chat.use-case");
const remove_user_from_chat_use_case_1 = require("../../../application/use-cases/remove-user-from-chat.use-case");
const mark_messages_as_read_use_case_1 = require("../../../application/use-cases/mark-messages-as-read.use-case");
const prisma_service_1 = require("../../database/prisma.service");
const shared_2 = require("../../../shared");
const message_type_enum_1 = require("../../../domain/enums/message-type.enum");
const pagination_params_dto_1 = require("../resources/pagination-params.dto");
const chat_resource_dto_1 = require("../resources/chat-resource.dto");
const message_resource_dto_1 = require("../resources/message-resource.dto");
const chat_member_resource_dto_1 = require("../resources/chat-member-resource.dto");
const shared_3 = require("../../../shared");
const exceptions_1 = require("../../../shared/exceptions");
const requests_1 = require("../requests");
const responses_1 = require("../responses");
let ChatController = class ChatController {
    constructor(createChatUseCase, sendMessageUseCase, addUserToChatUseCase, removeUserFromChatUseCase, markMessageAsReadUseCase, markAllMessagesAsReadUseCase, markMultipleMessagesAsReadUseCase, fileService, chatPolicy, chatRepository, messageRepository, chatMemberRepository, userRepository, prismaService) {
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
        this.prismaService = prismaService;
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
        const paginatedResult = await this.chatRepository.findByProjectIdPaginatedWithExtras(projectId, req.user.userId, paginationParams.page, paginationParams.perPage);
        const filteredChats = [];
        for (const chatWithExtras of paginatedResult.data) {
            if (await this.chatPolicy.view(user, chatWithExtras)) {
                const chatResource = chat_resource_dto_1.ChatResource.fromEntityWithExtras(chatWithExtras);
                if (chatResource.lastMessage) {
                    chatResource.lastMessage = chatResource.lastMessage.withReadStatus(req.user.userId);
                }
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
        const canCreateInProject = await this.chatPolicy.canCreateChatInProject(req.user.userId, projectId);
        if (!canCreateInProject) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to create chats in this project');
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
        const chat = await this.chatRepository.findByIdWithExtras(id);
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
        const chatResource = chat_resource_dto_1.ChatResource.fromEntityWithExtras(chat);
        return {
            success: true,
            data: chatResource
        };
    }
    async getMessages(projectId, chatId, req, perPage, createdAt, sort) {
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
        const paginatedResult = await this.messageRepository.findByChatId(chatId, createdAt, sort, perPage);
        const senderIds = [...new Set(paginatedResult.data.map(message => message.senderId))];
        const senders = await Promise.all(senderIds.map(id => this.userRepository.findById(id)));
        const sendersMap = new Map(senders.filter(Boolean).map(user => [user.id, user]));
        const messagesWithReadStatus = paginatedResult.data.map(message => {
            const sender = sendersMap.get(message.senderId);
            return message_resource_dto_1.MessageResource.fromEntity(message)
                .withReadStatus(req.user.userId)
                .withSender(sender);
        });
        return {
            success: true,
            data: messagesWithReadStatus,
            pagination: {
                total: 0,
                page: 1,
                limit: 10
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
        const validation = await this.chatPolicy.validateUserForChatAddition(addUserDto.userId, chatId);
        if (!validation.isValid) {
            throw new exceptions_1.ResourceNotFoundException(validation.reason);
        }
        const canAddMember = await this.chatPolicy.canAddMembersToProjectChat(chatId, req.user.userId, addUserDto.userId, projectId);
        if (!canAddMember) {
            throw new exceptions_1.AccessDeniedException('You cannot add this user to the chat. User must be a project member and you must have appropriate permissions.');
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
        const validation = await this.chatPolicy.validateUserForChatRemoval(userId, chatId);
        if (!validation.isValid) {
            throw new exceptions_1.ResourceNotFoundException(validation.reason);
        }
        const canRemove = await this.chatPolicy.canRemoveMemberFromChat(chatId, req.user.userId, userId);
        if (!canRemove) {
            throw new exceptions_1.AccessDeniedException('You do not have permission to remove this user from the chat');
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
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chats retrieved successfully', type: responses_1.ChatListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view chats', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found', type: responses_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat created successfully', type: responses_1.ChatCreateResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to create chats', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, requests_1.CreateChatDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get chat details',
        description: 'Retrieve detailed chat information'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat details retrieved successfully', type: responses_1.ChatResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view this chat', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: responses_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiQuery)({ name: 'per_page', required: false, description: 'Number of items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'created_at', required: false, description: 'Filter messages by creation date' }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, enum: ['asc', 'desc'], description: 'Sort order for messages' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages retrieved successfully', type: responses_1.MessageListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view this chat', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Query)('per_page')),
    __param(4, (0, common_1.Query)('created_at')),
    __param(5, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Number, String, String]),
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
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent successfully', type: responses_1.MessageCreateResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to send messages', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __param(4, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, requests_1.SendMessageDto, Object, Object]),
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
        type: responses_1.ChatMemberResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to add members', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, requests_1.AddUserToChatDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "addUserToChat", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, shared_1.RequireAnyPermission)(shared_1.Permission.MANAGE_ALL_CHATS, shared_1.Permission.UPDATE_CHATS),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove user from chat',
        description: 'Remove a user from the chat'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User removed from chat successfully', type: responses_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to remove members', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: responses_1.ErrorResponseDto }),
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
        type: [responses_1.ChatMemberResponseDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view this chat', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: responses_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message marked as read', type: responses_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to access this chat', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: responses_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All messages marked as read', type: responses_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to access this chat', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: responses_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages marked as read', type: responses_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to access this chat', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or User not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, requests_1.MarkMessagesAsReadDto, Object]),
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
        shared_2.ChatPolicy, Object, Object, Object, Object, prisma_service_1.PrismaService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map