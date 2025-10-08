import { ApiProperty } from '@nestjs/swagger';

export class ChatMemberResponseDto {
    @ApiProperty({ example: 'clm1member123456' })
    id: string;

    @ApiProperty({ example: 'clm1chat123456' })
    chatId: string;

    @ApiProperty({ example: 'clm1user123456' })
    userId: string;

    @ApiProperty({ example: 'member' })
    role: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    joinedAt: string;
}
