import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MessageType } from '../../../domain/enums';

export class SendMessageDto {
    @ApiProperty({ description: 'Message content' })
    @IsString()
    content: string;

    @ApiProperty({ enum: MessageType, description: 'Message type', required: false })
    @IsOptional()
    @IsEnum(MessageType)
    type?: MessageType;
}
