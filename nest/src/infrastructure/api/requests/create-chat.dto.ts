import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsUUID } from 'class-validator';
import { ChatStatus } from '../../../domain/enums';

export class CreateChatDto {
    @ApiProperty({ description: 'Chat name', example: 'Project Discussion' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Chat description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: ChatStatus, description: 'Chat status', required: false })
    @IsOptional()
    @IsEnum(ChatStatus)
    status?: ChatStatus;

    @ApiProperty({
        description: 'Array of user IDs to add to chat',
        type: [String],
        required: false,
        example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001']
    })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    members?: string[];
}
