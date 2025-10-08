import { ApiProperty } from '@nestjs/swagger';
import { MessageResponseDto } from './message-response.dto';

export class MessageCreateResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Message sent successfully' })
    message: string;

    @ApiProperty({ type: MessageResponseDto })
    data: MessageResponseDto;
}
