import { ApiProperty } from '@nestjs/swagger';
import { ChatResponseDto } from './chat-response.dto';

export class ChatCreateResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Chat created successfully' })
    message: string;

    @ApiProperty({ type: ChatResponseDto })
    data: ChatResponseDto;
}
