import { MessageResponseDto } from './message-response.dto';
export declare class ChatResponseDto {
    id: string;
    name: string;
    description: string | null;
    status: string;
    projectId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    unreadCount?: number;
    lastMessage?: MessageResponseDto;
}
