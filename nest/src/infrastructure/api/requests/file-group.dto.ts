import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileGroupDto {
  @ApiProperty({
    description: 'Name of the file group',
    example: 'Project Documents',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Description of the file group',
    example: 'All project-related documents and files',
    maxLength: 500
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Type of entity this group belongs to',
    example: 'project',
    enum: ['project', 'task', 'chat', 'user']
  })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({
    description: 'ID of the entity this group belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  entityId: string;
}

export class UpdateFileGroupDto {
  @ApiPropertyOptional({
    description: 'Name of the file group',
    example: 'Updated Project Documents',
    minLength: 1,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the file group',
    example: 'Updated description for project-related documents',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
