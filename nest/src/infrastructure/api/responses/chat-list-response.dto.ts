import { ApiProperty } from '@nestjs/swagger';
import { ChatResponseDto } from './chat-response.dto';

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
