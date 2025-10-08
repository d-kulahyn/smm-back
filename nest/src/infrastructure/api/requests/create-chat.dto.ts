import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
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
}
