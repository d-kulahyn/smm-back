import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { TaskPriority, TaskStatus } from  '../../../domain/enums';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', example: 'Complete project documentation' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Task description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Project ID where task belongs' })
  @IsString()
  project_id: string;

  @ApiProperty({ enum: TaskPriority, description: 'Task priority', required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ enum: TaskStatus, description: 'Task status', required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ description: 'Task due date', required: false, type: 'string', format: 'date-time' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ description: 'User ID to assign task to', required: false })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Reminder time in hours before the due date', required: false })
  @IsOptional()
  reminderBeforeHours?: number;
}
