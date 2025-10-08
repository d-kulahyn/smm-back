import { ApiProperty } from '@nestjs/swagger';
import { MessageResponseDto } from './message-response.dto';

export class ChatResponseDto {
    @ApiProperty({ example: 'clm1abc123def456' })
    id: string;

    @ApiProperty({ example: 'Project Discussion' })
    name: string;

    @ApiProperty({ example: 'Chat for project coordination', nullable: true })
    description: string | null;

    @ApiProperty({ example: 'active' })
    status: string;

    @ApiProperty({ example: 'clm1project123456' })
    projectId: string;

    @ApiProperty({ example: 'clm1creator123456' })
    createdBy: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;

    @ApiProperty({ example: 5, description: 'Number of unread messages for current user' })
    unreadCount?: number;

    @ApiProperty({ type: MessageResponseDto, description: 'Last message in the chat', nullable: true })
    lastMessage?: MessageResponseDto;
}
