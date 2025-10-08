import { ApiProperty } from '@nestjs/swagger';

export class ProjectStatsResponseDto {
  @ApiProperty({ example: 5 })
  totalProjects: number;

  @ApiProperty({ example: 3 })
  activeProjects: number;

  @ApiProperty({ example: 1 })
  completedProjects: number;

  @ApiProperty({ example: 1 })
  onHoldProjects: number;

  @ApiProperty({ example: 15 })
  totalTasks: number;

  @ApiProperty({ example: 8 })
  completedTasks: number;

  @ApiProperty({ example: 7 })
  pendingTasks: number;
}
