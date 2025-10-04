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
import {ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiProperty, ApiConsumes, ApiResponse} from '@nestjs/swagger';
import {IsString, IsOptional, IsEnum, IsUUID} from 'class-validator';
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
    MarkAllMessagesAsReadUseCase
} from '../../../application/use-cases/mark-messages-as-read.use-case';
// Repositories imports
import {ChatRepository} from '../../../domain/repositories/chat.repository';
import {MessageRepository} from '../../../domain/repositories/message.repository';
import {ChatMemberRepository} from '../../../domain/repositories/chat-member.repository';
import {UserRepository} from '../../../domain/repositories/user.repository';
import {ChatPolicy} from '../../../shared';
import {ChatStatus} from '../../../domain/enums/chat-status.enum';
import {MessageType} from '../../../domain/enums/message-type.enum';
import {ChatMemberRole} from '../../../domain/entities/chat-member.entity';
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

// Response DTOs для Swagger документации
export class ChatResponseDto {
    @ApiProperty({ example: 'clm1abc123def456' })
    id: string;

    @ApiProperty({ example: 'Project Discussion' })
    name: string;

    @ApiProperty({ example: 'Chat for project coordination', nullable: true })
    description: string | null;

    @ApiProperty({ example: 'active' })
    status: string;

    @ApiProperty({ example: 'clm1project123456' })
    projectId: string;

    @ApiProperty({ example: 'clm1creator123456' })
    createdBy: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;
}

export class MessageResponseDto {
    @ApiProperty({ example: 'clm1msg123def456' })
    id: string;

    @ApiProperty({ example: 'Hello everyone!' })
    content: string;

    @ApiProperty({ example: 'text' })
    type: string;

    @ApiProperty({ example: 'clm1chat123456' })
    chatId: string;

    @ApiProperty({ example: 'clm1sender123456' })
    senderId: string;

    @ApiProperty({ example: 'file-path.jpg', nullable: true })
    fileUrl: string | null;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;
}

export class ChatMemberResponseDto {
    @ApiProperty({ example: 'clm1member123456' })
    id: string;

    @ApiProperty({ example: 'clm1chat123456' })
    chatId: string;

    @ApiProperty({ example: 'clm1user123456' })
    userId: string;

    @ApiProperty({ example: 'member' })
    role: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    joinedAt: string;
}

export class ChatListResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [ChatResponseDto] })
    data: ChatResponseDto[];

    @ApiProperty({
        type: 'object',
        properties: {
            total: { type: 'number', example: 5 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 }
        }
    })
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export class MessageListResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [MessageResponseDto] })
    data: MessageResponseDto[];

    @ApiProperty({
        type: 'object',
        properties: {
            total: { type: 'number', example: 50 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 }
        }
    })
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export class MessageCreateResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Message sent successfully' })
    message: string;

    @ApiProperty({ type: MessageResponseDto })
    data: MessageResponseDto;
}

export class ChatCreateResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Chat created successfully' })
    message: string;

    @ApiProperty({ type: ChatResponseDto })
    data: ChatResponseDto;
}

export class MessageDto {
    @ApiProperty({ example: 'Operation completed successfully' })
    message: string;
}

export class ErrorResponseDto {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: 'Bad Request' })
    error: string;

    @ApiProperty({ example: 'Validation failed' })
    message: string;
}

export class CreateChatDto {
    @ApiProperty({description: 'Chat name', example: 'Project Discussion'})
    @IsString()
    name: string;

    @ApiProperty({description: 'Chat description', required: false})
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({enum: ChatStatus, description: 'Chat status', required: false})
    @IsOptional()
    @IsEnum(ChatStatus)
    status?: ChatStatus;
}

export class SendMessageDto {
    @ApiProperty({description: 'Message content'})
    @IsString()
    content: string;

    @ApiProperty({enum: MessageType, description: 'Message type', required: false})
    @IsOptional()
    @IsEnum(MessageType)
    type?: MessageType;
}

export class AddUserToChatDto {
    @ApiProperty({description: 'User ID to add to chat'})
    @IsUUID()
    userId: string;

    @ApiProperty({enum: ChatMemberRole, description: 'User role in chat', required: false})
    @IsOptional()
    @IsEnum(ChatMemberRole)
    role?: ChatMemberRole;
}

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
    @ApiResponse({ status: 200, description: 'Chats retrieved successfully', type: ChatListResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to view chats', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponseDto })
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

        const paginatedResult = await this.chatRepository.findByProjectIdPaginated(
            projectId,
            paginationParams.page,
            paginationParams.perPage
        );

        // Filter chats by access rights
        const filteredChats = [];
        for (const chat of paginatedResult.data) {
            if (await this.chatPolicy.view(user, chat)) {
                filteredChats.push(chat);
            }
        }

        return {
            success: true,
            data: ChatResource.collection(filteredChats),
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
    @ApiResponse({ status: 201, description: 'Chat created successfully', type: ChatCreateResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to create chats', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponseDto })
    async store(
        @Param('projectId') projectId: string,
        @Body() createChatDto: CreateChatDto,
        @Request() req: AuthenticatedRequest
    ) {
        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!this.chatPolicy.create(user)) {
            throw new AccessDeniedException('You do not have permission to create chats');
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
    @ApiResponse({ status: 200, description: 'Chat details retrieved successfully', type: ChatResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to view this chat', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto })
    async show(
        @Param('projectId') projectId: string,
        @Param('id') id: string,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findById(id);
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

        return {
            success: true,
            data: ChatResource.fromEntity(chat)
        };
    }

    @Get(':id/messages')
    @ApiOperation({
        summary: 'Get chat messages',
        description: 'Retrieve paginated list of messages for a specific chat'
    })
    @ApiResponse({ status: 200, description: 'Messages retrieved successfully', type: MessageListResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to view this chat', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto })
    async getMessages(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Request() req: AuthenticatedRequest,
        @Query('page') page?: string,
        @Query('per_page') perPage?: string
    ) {
        const chat = await this.chatRepository.findById(chatId);
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

        const paginationParams = PaginationParamsDto.fromQuery(page, perPage);

        const paginatedResult = await this.messageRepository.findByChatId(
            chatId,
            paginationParams.page,
            paginationParams.perPage
        );

        return {
            success: true,
            data: MessageResource.collection(paginatedResult.data),
            pagination: {
                total: paginatedResult.total,
                page: paginatedResult.page,
                limit: paginatedResult.limit
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
    @ApiResponse({ status: 201, description: 'Message sent successfully', type: MessageCreateResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to send messages', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto })
    async sendMessage(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Body() sendMessageDto: SendMessageDto,
        @Request() req: AuthenticatedRequest,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const chat = await this.chatRepository.findById(chatId);
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
            // Determine message type by file
            if (file.mimetype.startsWith('image/')) {
                messageType = MessageType.IMAGE;
            } else if (file.mimetype.startsWith('audio/')) {
                messageType = MessageType.VOICE;
            } else {
                messageType = MessageType.FILE;
            }

            // Save file
            const savedFile = await this.fileService.saveMessageFile(file);
            fileUrl = savedFile.filePath;
        }

        const message = await this.sendMessageUseCase.execute({
            chatId,
            senderId: req.user.userId,
            content: sendMessageDto.content,
            type: messageType,
            fileUrl,
            projectId, // Передаем projectId для события
        });

        return {
            success: true,
            message: 'Message sent successfully',
            data: MessageResource.fromEntity(message)
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
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'User added to chat successfully' },
                data: { $ref: '#/components/schemas/ChatMemberResponseDto' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to add members', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto })
    async addUserToChat(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Body() addUserDto: AddUserToChatDto,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat not found');
        }

        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!await this.chatPolicy.canAddMembers(chatId, req.user.userId)) {
            throw new AccessDeniedException('You do not have permission to add members to this chat');
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
    @ApiResponse({ status: 200, description: 'User removed from chat successfully', type: MessageDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to remove members', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto })
    async removeUserFromChat(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Param('userId') userId: string,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new ResourceNotFoundException('Chat not found');
        }

        const user = await this.userRepository.findById(req.user.userId);
        if (!user) {
            throw new ResourceNotFoundException('User', req.user.userId);
        }

        if (!await this.chatPolicy.canRemoveMembers(chatId, req.user.userId)) {
            throw new AccessDeniedException('You do not have permission to remove members from this chat');
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
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ChatMemberResponseDto' }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to view this chat', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto })
    async getChatMembers(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findById(chatId);
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
    @ApiResponse({ status: 200, description: 'Message marked as read', type: MessageDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to access this chat', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto })
    async markMessageAsRead(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Param('messageId') messageId: string,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findById(chatId);
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
    @ApiResponse({ status: 200, description: 'All messages marked as read', type: MessageDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - No permission to access this chat', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'Chat or User not found', type: ErrorResponseDto })
    async markAllMessagesAsRead(
        @Param('projectId') projectId: string,
        @Param('id') chatId: string,
        @Request() req: AuthenticatedRequest
    ) {
        const chat = await this.chatRepository.findById(chatId);
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

        await this.markAllMessagesAsReadUseCase.execute({
            chatId,
            userId: req.user.userId,
        });

        return {
            success: true,
            message: 'All messages marked as read'
        };
    }
}
