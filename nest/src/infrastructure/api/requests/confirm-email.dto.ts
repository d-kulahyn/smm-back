import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmEmailDto {
    @ApiProperty({ description: 'Email confirmation code', example: 'A1B2C3' })
    @IsString()
    code: string;
}
