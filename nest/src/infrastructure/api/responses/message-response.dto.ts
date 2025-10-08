import { ApiProperty } from '@nestjs/swagger';
import { MessageSenderResponseDto } from './message-sender-response.dto';

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

    @ApiProperty({ example: true, description: 'Whether the message is read by current user' })
    isReadByCurrentUser?: boolean;

    @ApiProperty({ type: MessageSenderResponseDto, description: 'Message sender information', nullable: true })
    sender?: MessageSenderResponseDto;
}
