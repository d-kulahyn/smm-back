import { ApiProperty } from '@nestjs/swagger';

export class TaskStatsResponseDto {
  @ApiProperty({ example: 25 })
  total_tasks: number;

  @ApiProperty({ example: 10 })
  completed_tasks: number;

  @ApiProperty({ example: 12 })
  pending_tasks: number;

  @ApiProperty({ example: 3 })
  in_progress_tasks: number;

  @ApiProperty({ example: 2 })
  overdue_tasks: number;

  @ApiProperty({ example: 40 })
  completion_rate: number;
}
