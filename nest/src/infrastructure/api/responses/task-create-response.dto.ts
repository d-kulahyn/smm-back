import { ApiProperty } from '@nestjs/swagger';
import { TaskResponseDto } from './task-response.dto';

export class TaskCreateResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Task created successfully' })
  message: string;

  @ApiProperty({ type: TaskResponseDto })
  data: TaskResponseDto;
}
