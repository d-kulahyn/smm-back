import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;

    @ApiProperty({
        type: 'object',
        properties: {
            id: { type: 'string', example: 'clm1abc123def456' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            avatar: { type: 'string', nullable: true, example: null },
            role: { type: 'string', example: 'CLIENT' },
            permissions: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean', example: true },
            emailVerifiedAt: { type: 'string', nullable: true, example: null }
        }
    })
    user: {
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: string;
        permissions: string[];
        isActive: boolean;
        emailVerifiedAt: string | null;
    };
}
