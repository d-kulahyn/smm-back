import { ApiProperty } from '@nestjs/swagger';
import { ProjectResponseDto } from './project-response.dto';

export class ProjectCreateResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Project created successfully' })
  message: string;

  @ApiProperty({ type: ProjectResponseDto })
  data: ProjectResponseDto;
}
