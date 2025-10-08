import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MarkMessagesAsReadDto {
    @ApiProperty({
        description: 'Array of message IDs to mark as read',
        example: ['clm1msg123def456', 'clm1msg789ghi012'],
        type: [String]
    })
    @IsUUID('4', { each: true })
    messageIds: string[];
}
