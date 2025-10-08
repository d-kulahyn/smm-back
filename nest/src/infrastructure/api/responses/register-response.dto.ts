import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Registration successful. Please check your email for verification code.' })
    message: string;

    @ApiProperty({
        type: 'object',
        properties: {
            userId: { type: 'string', example: 'clm1abc123def456' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            code: { type: 'string', example: 'A1B2C3' }
        }
    })
    data: {
        userId: string;
        email: string;
        name: string;
        code: string;
    };
}
