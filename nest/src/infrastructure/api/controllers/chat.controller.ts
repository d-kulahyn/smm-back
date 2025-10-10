import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    Inject,
    Query,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiConsumes, ApiResponse} from '@nestjs/swagger';
import {FileInterceptor} from '@nestjs/platform-express';
import {JwtAuthGuard} from '../../../shared/guards/jwt-auth.guard';
import {PermissionsGuard, RequireAnyPermission, Permission} from '../../../shared';
import {AuthenticatedRequest} from '../../../shared';
// Use Cases imports
import {CreateChatUseCase} from '../../../application/use-cases/create-chat.use-case';
import {SendMessageUseCase} from '../../../application/use-cases/send-message.use-case';
import {AddUserToChatUseCase} from '../../../application/use-cases/add-user-to-chat.use-case';
import {RemoveUserFromChatUseCase} from '../../../application/use-cases/remove-user-from-chat.use-case';
import {
    MarkMessageAsReadUseCase,
    MarkAllMessagesAsReadUseCase,
    MarkMultipleMessagesAsReadUseCase
} from '../../../application/use-cases/mark-messages-as-read.use-case';
// Repositories imports
import {ChatRepository} from '../../../domain/repositories/chat.repository';
import {MessageRepository} from '../../../domain/repositories/message.repository';
import {ChatMemberRepository} from '../../../domain/repositories/chat-member.repository';
import {UserRepository} from '../../../domain/repositories/user.repository';
import {PrismaService} from '../../database/prisma.service';
import {ChatPolicy} from '../../../shared';
import {MessageType} from '../../../domain/enums/message-type.enum';
import {PaginationParamsDto} from '../resources/pagination-params.dto';
import {ChatResource} from '../resources/chat-resource.dto';
import {MessageResource} from '../resources/message-resource.dto';
import {ChatMemberResource} from '../resources/chat-member-resource.dto';
import {FileService} from '../../../shared';
// Custom exceptions
import {
    ResourceNotFoundException,
    AccessDeniedException,
} from '../../../shared/exceptions';

// Request DTOs
import {
    CreateChatDto,
    SendMessageDto,
    AddUserToChatDto,
    MarkMessagesAsReadDto
} from '../requests';

// Response DTOs
import {
    MessageSenderResponseDto,
    MessageResponseDto,
    ChatResponseDto,
    ChatMemberResponseDto,
    ChatListResponseDto,
    MessageListResponseDto,
    MessageCreateResponseDto,
    ChatCreateResponseDto,
    MessageResponseDto as MessageDto,
    ErrorResponseDto
} from '../responses';

@ApiTags('chats')
@Controller('projects/:projectId/chats')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ChatController {
    constructor(
        private readonly createChatUseCase: CreateChatUseCase,
        private readonly sendMessageUseCase: SendMessageUseCase,
        private readonly addUserToChatUseCase: AddUserToChatUseCase,
        private readonly removeUserFromChatUseCase: RemoveUserFromChatUseCase,
        private readonly markMessageAsReadUseCase: MarkMessageAsReadUseCase,
        private readonly markAllMessagesAsReadUseCase: MarkAllMessagesAsReadUseCase,
        private readonly markMultipleMessagesAsReadUseCase: MarkMultipleMessagesAsReadUseCase,
        private readonly fileService: FileService,
        private readonly chatPolicy: ChatPolicy,
        @Inject('CHAT_REPOSITORY')
        private readonly chatRepository: ChatRepository,
        @Inject('MESSAGE_REPOSITORY')
        private readonly messageRepository: MessageRepository,
        @Inject('CHAT_MEMBER_REPOSITORY')
        private readonly chatMemberRepository: ChatMemberRepository,
        @Inject('USER_REPOSITORY')
        private readonly userRepository: UserRepository,
    ) {
    }

    @Get()
    @RequireAnyPermission(Permission.MANAGE_ALL_CHATS, Permission.VIEW_PROJECT_CHATS)
    @ApiOperation({
        summary: 'Get project chats',
        description: 'Retrieve paginated list of chats for a specific project'
    })
    @ApiResponse({status: 200, description: 'Chats retrieved successfully', type: ChatListResponseDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to view chats', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'User not found', type: ErrorResponseDto})
    async index(
        @Param('projectId') projectId: string,
        @Request() req: AuthenticatedRequest,
        @Query('page') page?: string,
        @Query('per_page') perPage?: string
    ) {
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!this.chatPolicy.viewAny(user)) {
            throw new AccessDeniedException('You do not have permission to view chats');
        }

        const paginationParams = PaginationParamsDto.fromQuery(page, perPage);

        const paginatedResult = await this.chatRepository.findByProjectIdPaginatedWithExtras(
            projectId,
            req.user.userId,
            paginationParams.page,
            paginationParams.perPage,
        );

        const filteredChats = [];
        for (const chatWithExtras of paginatedResult.data) {
            if (await this.chatPolicy.view(user, chatWithExtras)) {
                const chatResource = ChatResource.fromEntityWithExtras(chatWithExtras);
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

    @Post()
    @RequireAnyPermission(Permission.MANAGE_ALL_CHATS, Permission.CREATE_CHATS)
    @ApiOperation({
        summary: 'Create a new chat',
        description: 'Create a new chat for a specific project'
    })
    @ApiResponse({status: 201, description: 'Chat created successfully', type: ChatCreateResponseDto})
    @ApiResponse({status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to create chats', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'User not found', type: ErrorResponseDto})
    async store(
        @Param('projectId') projectId: string,
        @Body() createChatDto: CreateChatDto,
        @Request() req: AuthenticatedRequest
    ) {
        const canCreateInProject = await this.chatPolicy.canCreateChatInProject(req.user.userId, projectId);
        if (!canCreateInProject) {
            throw new AccessDeniedException('You do not have permission to create chats in this project');
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
            data: ChatResource.fromEntity(chat)
        };
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get chat details',
        description: 'Retrieve detailed chat information'
    })
    @ApiResponse({status: 200, description: 'Chat details retrieved successfully', type: ChatResponseDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to view this chat', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'Chat or User not found', type: ErrorResponseDto})
    async show(
        @Param('projectId') projectId: string,
        @Param('id') id: string,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findByIdWithExtras(id, req.user.userId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat', id);
        }

        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!await this.chatPolicy.view(user, chat)) {
            throw new AccessDeniedException('You do not have permission to view this chat');
        }

        const chatResource = ChatResource.fromEntityWithExtras(chat);

        return {
            success: true,
            data: chatResource
        };
    }

    @Get(':id/messages')
    @ApiOperation({
        summary: 'Get chat messages',
        description: 'Retrieve paginated list of messages for a specific chat'
    })
    @ApiQuery({name: 'per_page', required: false, description: 'Number of items per page'})
    @ApiQuery({name: 'created_at', required: false, description: 'Filter messages by creation date'})
    @ApiQuery({name: 'sort', required: false, enum: ['asc', 'desc'], description: 'Sort order for messages'})
    @ApiResponse({status: 200, description: 'Messages retrieved successfully', type: MessageListResponseDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to view this chat', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'Chat or User not found', type: ErrorResponseDto})
    async getMessages(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Request() req: AuthenticatedRequest,
        @Query('per_page') perPage?: number,
        @Query('created_at') createdAt?: string,
        @Query('sort') sort?: 'asc' | 'desc'
    ) {
        const chat = await this.chatRepository.findByIdWithExtras(chatId, req.user.userId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat not found');
        }

        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!await this.chatPolicy.view(user, chat)) {
            throw new AccessDeniedException('You do not have permission to view this chat');
        }

        const paginatedResult = await this.messageRepository.findByChatId(
            chatId,
            req.user.userId,
            createdAt,
            sort,
            perPage
        );

        const senderIds = [...new Set(paginatedResult.data.map(message => message.senderId))];
        const senders = await Promise.all(
            senderIds.map(id => this.userRepository.findById(id))
        );
        const sendersMap = new Map(senders.filter(Boolean).map(user => [user.id, user]));

        const messagesWithReadStatus = paginatedResult.data.map(message => {
            const sender = sendersMap.get(message.senderId);
            return MessageResource.fromEntity(message)
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

    @Post(':id/messages')
    @ApiOperation({
        summary: 'Send a message',
        description: 'Send a message to the chat'
    })
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiResponse({status: 201, description: 'Message sent successfully', type: MessageCreateResponseDto})
    @ApiResponse({status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to send messages', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'Chat or User not found', type: ErrorResponseDto})
    async sendMessage(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Body() sendMessageDto: SendMessageDto,
        @Request() req: AuthenticatedRequest,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const chat = await this.chatRepository.findByIdWithExtras(chatId, req.user.userId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat not found');
        }

        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!await this.chatPolicy.sendMessage(user, chat)) {
            throw new AccessDeniedException('You do not have permission to send messages in this chat');
        }

        let fileUrl: string | undefined;
        let messageType = sendMessageDto.type || MessageType.TEXT;

        if (file) {
            if (file.mimetype.startsWith('image/')) {
                messageType = MessageType.IMAGE;
            } else if (file.mimetype.startsWith('audio/')) {
                messageType = MessageType.VOICE;
            } else {
                messageType = MessageType.FILE;
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
            data: MessageResource.fromEntity(message).withReadStatus(req.user.userId)
        };
    }

    @Post(':id/members')
    @RequireAnyPermission(Permission.MANAGE_ALL_CHATS, Permission.UPDATE_CHATS)
    @ApiOperation({
        summary: 'Add user to chat',
        description: 'Add a user to the chat with specified role'
    })
    @ApiResponse({
        status: 201,
        description: 'User added to chat successfully',
        type: ChatMemberResponseDto
    })
    @ApiResponse({status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to add members', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'Chat or User not found', type: ErrorResponseDto})
    async addUserToChat(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Body() addUserDto: AddUserToChatDto,
        @Request() req: AuthenticatedRequest
    ) {
        const validation = await this.chatPolicy.validateUserForChatAddition(addUserDto.userId, chatId);
        if (!validation.isValid) {
            throw new ResourceNotFoundException(validation.reason);
        }

        const canAddMember = await this.chatPolicy.canAddMembersToProjectChat(
            chatId,
            req.user.userId,
            addUserDto.userId,
            projectId
        );

        if (!canAddMember) {
            throw new AccessDeniedException('You cannot add this user to the chat. User must be a project member and you must have appropriate permissions.');
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
            data: ChatMemberResource.fromEntity(chatMember)
        };
    }


    @Delete(':id/members/:userId')
    @RequireAnyPermission(Permission.MANAGE_ALL_CHATS, Permission.UPDATE_CHATS)
    @ApiOperation({
        summary: 'Remove user from chat',
        description: 'Remove a user from the chat'
    })
    @ApiResponse({status: 200, description: 'User removed from chat successfully', type: MessageDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to remove members', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'Chat or User not found', type: ErrorResponseDto})
    async removeUserFromChat(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Param('userId') userId: string,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findByIdWithExtras(chatId, req.user.userId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat not found');
        }

        const validation = await this.chatPolicy.validateUserForChatRemoval(userId, chatId);
        if (!validation.isValid) {
            throw new ResourceNotFoundException(validation.reason);
        }

        const canRemove = await this.chatPolicy.canRemoveMemberFromChat(chatId, req.user.userId, userId);
        if (!canRemove) {
            throw new AccessDeniedException('You do not have permission to remove this user from the chat');
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

    @Get(':id/members')
    @ApiOperation({
        summary: 'Get chat members',
        description: 'Retrieve list of chat members'
    })
    @ApiResponse({
        status: 200,
        description: 'Chat members retrieved successfully',
        type: [ChatMemberResponseDto]
    })
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to view this chat', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'Chat or User not found', type: ErrorResponseDto})
    async getChatMembers(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findByIdWithExtras(chatId, req.user.userId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat not found');
        }

        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!await this.chatPolicy.view(user, chat)) {
            throw new AccessDeniedException('You do not have permission to view this chat');
        }

        const members = await this.chatMemberRepository.findByChatId(chatId);

        return {
            success: true,
            data: ChatMemberResource.collection(members)
        };
    }

    @Put(':id/messages/:messageId/read')
    @ApiOperation({
        summary: 'Mark message as read',
        description: 'Mark a specific message as read by the current user'
    })
    @ApiResponse({status: 200, description: 'Message marked as read', type: MessageDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to access this chat', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'Chat or User not found', type: ErrorResponseDto})
    async markMessageAsRead(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Param('messageId') messageId: string,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findByIdWithExtras(chatId, req.user.userId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat not found');
        }

        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!await this.chatPolicy.view(user, chat)) {
            throw new AccessDeniedException('You do not have permission to access this chat');
        }

        await this.markMessageAsReadUseCase.execute({
            messageId,
            userId: req.user.userId,
            chatId
        });

        return {
            success: true,
            message: 'Message marked as read'
        };
    }

    @Put(':id/messages/read-all')
    @ApiOperation({
        summary: 'Mark all messages as read',
        description: 'Mark all messages in the chat as read by the current user'
    })
    @ApiResponse({status: 200, description: 'All messages marked as read', type: MessageDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to access this chat', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'Chat or User not found', type: ErrorResponseDto})
    async markAllMessagesAsRead(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Query('limit') limit: number,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findByIdWithExtras(chatId, req.user.userId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat not found');
        }

        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!await this.chatPolicy.view(user, chat)) {
            throw new AccessDeniedException('You do not have permission to access this chat');
        }

        const messages = await this.markAllMessagesAsReadUseCase.execute({
            chatId,
            userId: req.user.userId,
            limit
        });

        return {
            success: true,
            data: MessageResource.collection(messages, req.user.userId)
        };
    }

    @Put(':id/messages/read-multiple')
    @ApiOperation({
        summary: 'Mark multiple messages as read',
        description: 'Mark multiple messages as read by the current user'
    })
    @ApiResponse({status: 200, description: 'Messages marked as read', type: MessageDto})
    @ApiResponse({status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto})
    @ApiResponse({status: 401, description: 'Unauthorized', type: ErrorResponseDto})
    @ApiResponse({status: 403, description: 'Forbidden - No permission to access this chat', type: ErrorResponseDto})
    @ApiResponse({status: 404, description: 'Chat or User not found', type: ErrorResponseDto})
    async markMultipleMessagesAsRead(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Body() markMessagesDto: MarkMessagesAsReadDto,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findByIdWithExtras(chatId, req.user.userId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat not found');
        }

        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!await this.chatPolicy.view(user, chat)) {
            throw new AccessDeniedException('You do not have permission to access this chat');
        }

        await this.markMultipleMessagesAsReadUseCase.execute({
            messageIds: markMessagesDto.messageIds,
            userId: req.user.userId,
            chatId
        });

        return {
            success: true,
            message: `${markMessagesDto.messageIds.length} messages marked as read`
        };
    }
}
