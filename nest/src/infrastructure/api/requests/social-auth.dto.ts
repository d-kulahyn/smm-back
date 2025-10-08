import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialAuthDto {
    @ApiProperty({ description: 'Social provider access token', example: 'ya29.a0AfH6SMB...' })
    @IsString()
    access_token: string;
}
