import { ChatResponseDto } from './chat-response.dto';
export declare class ChatListResponseDto {
    success: boolean;
    data: ChatResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}
