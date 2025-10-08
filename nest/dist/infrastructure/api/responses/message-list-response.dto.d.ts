import { MessageResponseDto } from './message-response.dto';
export declare class MessageListResponseDto {
    success: boolean;
    data: MessageResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}
