import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({ example: 'clm1abc123def456' })
  id: string;

  @ApiProperty({ example: 'My Project' })
  name: string;

  @ApiProperty({ example: 'Project description', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: 'clm1owner123456' })
  ownerId: string;

  @ApiProperty({ example: '2024-01-01', nullable: true })
  startDate: string | null;

  @ApiProperty({ example: '2024-12-31', nullable: true })
  endDate: string | null;

  @ApiProperty({ example: 10000, nullable: true })
  budget: number | null;

  @ApiProperty({ example: 'avatar.jpg', nullable: true })
  avatar: string | null;

  @ApiProperty({ example: '#FF5733', nullable: true })
  color: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
