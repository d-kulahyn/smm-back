import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password', minLength: 6, example: 'password123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ description: 'User name', required: false, example: 'John Doe' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Firebase Cloud Messaging token', required: false })
    @IsOptional()
    @IsString()
    firebase_cloud_messaging_token?: string;
}
