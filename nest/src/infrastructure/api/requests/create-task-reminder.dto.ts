import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTaskReminderDto {
  @ApiProperty({ description: 'When to remind', type: 'string', format: 'date-time' })
  @IsDateString()
  remindAt: string;

  @ApiProperty({ description: 'Reminder message', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
