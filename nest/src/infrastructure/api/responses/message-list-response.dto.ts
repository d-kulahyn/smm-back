import { ApiProperty } from '@nestjs/swagger';
import { MessageResponseDto } from './message-response.dto';

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
