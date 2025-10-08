import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 'clm1abc123def456' })
  id: string;

  @ApiProperty({ example: 'Complete project documentation' })
  title: string;

  @ApiProperty({ example: 'Write comprehensive docs for the project', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 'high' })
  priority: string;

  @ApiProperty({ example: 'clm1project123456' })
  project_id: string;

  @ApiProperty({ example: 'clm1user123456', nullable: true })
  assigned_to: string | null;

  @ApiProperty({ example: '2024-12-31', nullable: true })
  due_date: string | null;

  @ApiProperty({ example: null, nullable: true })
  completed_at: string | null;

  @ApiProperty({ example: 'Additional notes', nullable: true })
  notes: string | null;

  @ApiProperty({ example: false })
  is_completed: boolean;

  @ApiProperty({ example: false })
  is_overdue: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: string;
}
