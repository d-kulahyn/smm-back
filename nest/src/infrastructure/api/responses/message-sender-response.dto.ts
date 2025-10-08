import { ApiProperty } from '@nestjs/swagger';

export class MessageSenderResponseDto {
    @ApiProperty({ example: 'clm1user123def456' })
    id: string;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
    avatar?: string;
}
