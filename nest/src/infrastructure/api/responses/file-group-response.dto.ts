import { ApiProperty } from '@nestjs/swagger';

export class FileGroupResponseDto {
  @ApiProperty({
    description: 'File group ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Name of the file group',
    example: 'Project Documents'
  })
  name: string;

  @ApiProperty({
    description: 'Description of the file group',
    example: 'All project-related documents and files'
  })
  description: string;

  @ApiProperty({
    description: 'Type of entity this group belongs to',
    example: 'project'
  })
  entityType: string;

  @ApiProperty({
    description: 'ID of the entity this group belongs to',
    example: '456e7890-e89b-12d3-a456-426614174000'
  })
  entityId: string;

  @ApiProperty({
    description: 'ID of user who created the group',
    example: '789e0123-e89b-12d3-a456-426614174000'
  })
  createdBy: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-10-12T10:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-10-12T10:00:00.000Z'
  })
  updatedAt: Date;
}

export class FileGroupCreateResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Success message',
    example: 'File group created successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Created file group data',
    type: FileGroupResponseDto
  })
  data: FileGroupResponseDto;
}

export class FileGroupListResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'List of file groups',
    type: [FileGroupResponseDto]
  })
  data: FileGroupResponseDto[];
}
