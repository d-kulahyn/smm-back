import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
    @ApiProperty({ example: 'clm1abc123def456' })
    id: string;

    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: null, nullable: true })
    avatar: string | null;

    @ApiProperty({ example: 'CLIENT' })
    role: string;

    @ApiProperty({ type: 'array', items: { type: 'string' } })
    permissions: string[];

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: null, nullable: true })
    emailVerifiedAt: string | null;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;
}
