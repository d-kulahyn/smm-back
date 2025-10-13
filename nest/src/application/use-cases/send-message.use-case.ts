import {Injectable, Inject} from '@nestjs/common';
import {Message} from '../../domain/entities/message.entity';
import {MessageRepository} from '../../domain/repositories/message.repository';
import {ChatMemberRepository} from '../../domain/repositories/chat-member.repository';
import {MessageType} from '../../domain/enums/message-type.enum';
import {BusinessException, AccessDeniedException} from '../../shared/exceptions';
import {EventBroadcastService} from '../../shared/events';
import {ChatMessageSentEvent} from '../../shared/events';
import {v4 as uuidv4} from 'uuid';
import {UserRepository} from "../../domain/repositories/user.repository";

export interface SendMessageDto {
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    attachments?: string[];
    fileUrl?: string;
    projectId?: string;
}

@Injectable()
export class SendMessageUseCase {
    constructor(
        @Inject('MESSAGE_REPOSITORY')
        private readonly messageRepository: MessageRepository,
        @Inject('CHAT_MEMBER_REPOSITORY')
        private readonly chatMemberRepository: ChatMemberRepository,
        private readonly eventBroadcastService: EventBroadcastService,
        @Inject('USER_REPOSITORY')
        private readonly userRepository: UserRepository,
    ) {
    }

    async execute(dto: SendMessageDto): Promise<Message> {
        if (!dto.content || dto.content.trim().length === 0) {
            throw new BusinessException('Message content cannot be empty', 'MESSAGE_CONTENT_REQUIRED');
        }

        if (dto.content.length > 5000) {
            throw new BusinessException('Message content cannot exceed 5000 characters', 'MESSAGE_CONTENT_TOO_LONG');
        }

        // Check if user is member of the chat
        const isMember = await this.chatMemberRepository.isUserInChat(dto.chatId, dto.senderId);
        if (!isMember) {
            throw new AccessDeniedException('You are not a member of this chat');
        }

        const message = Message.create({
            id: uuidv4(),
            chatId: dto.chatId,
            senderId: dto.senderId,
            content: dto.content.trim(),
            type: dto.type,
            attachments: dto.attachments,
            fileUrl: dto.fileUrl,
        });

        const createdMessage = await this.messageRepository.create(message);

        if (dto.projectId) {
            const allChatMembers = await this.chatMemberRepository.findByChatId(dto.chatId);
            const chatMembers = allChatMembers.map(member => member.userId);

            const event = new ChatMessageSentEvent(
                createdMessage,
                dto.chatId,
                dto.senderId,
                dto.projectId,
                chatMembers,
                this.messageRepository,
                this.userRepository
            );

            this.eventBroadcastService.broadcast(event).catch(error => {
                console.error('Failed to broadcast ChatMessageSent event:', error);
            });
        }

        return createdMessage;
    }
}
