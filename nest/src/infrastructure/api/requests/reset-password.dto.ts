import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ description: 'User email for password reset', example: 'user@example.com' })
    @IsEmail()
    email: string;
}
