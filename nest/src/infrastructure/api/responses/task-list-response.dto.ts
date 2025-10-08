import { ApiProperty } from '@nestjs/swagger';
import { TaskResponseDto } from './task-response.dto';

export class TaskListResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [TaskResponseDto] })
  data: TaskResponseDto[];

  @ApiProperty({
    type: 'object',
    properties: {
      total: { type: 'number', example: 25 },
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 }
    }
  })
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
