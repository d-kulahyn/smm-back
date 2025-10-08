import { MessageSenderResponseDto } from './message-sender-response.dto';
export declare class MessageResponseDto {
    id: string;
    content: string;
    type: string;
    chatId: string;
    senderId: string;
    fileUrl: string | null;
    createdAt: string;
    isReadByCurrentUser?: boolean;
    sender?: MessageSenderResponseDto;
}
