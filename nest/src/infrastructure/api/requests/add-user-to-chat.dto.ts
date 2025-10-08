import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ChatMemberRole } from '../../../domain/enums';

export class AddUserToChatDto {
    @ApiProperty({ description: 'User ID to add to chat' })
    @IsUUID()
    userId: string;

    @ApiProperty({ enum: ChatMemberRole, description: 'User role in chat', required: false })
    @IsOptional()
    @IsEnum(ChatMemberRole)
    role?: ChatMemberRole;
}
