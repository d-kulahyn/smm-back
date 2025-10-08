import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ProjectStatus } from '../../../domain/enums';

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name', example: 'My Project' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Project description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ProjectStatus, description: 'Project status' })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({ description: 'Project start date', required: false, type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Project end date', required: false, type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Project budget', required: false })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiProperty({ description: 'Project color', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Project avatar image', required: false })
  avatar?: any;
}
