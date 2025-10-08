import { ApiProperty } from '@nestjs/swagger';
import { ProjectInvitationResponseDto } from './project-invitation-response.dto';

export class InvitationListResponseDto {
  @ApiProperty({ type: [ProjectInvitationResponseDto] })
  data: ProjectInvitationResponseDto[];

  @ApiProperty({
    type: 'object',
    properties: {
      page: { type: 'number', example: 1 },
      perPage: { type: 'number', example: 15 },
      total: { type: 'number', example: 50 },
      totalPages: { type: 'number', example: 4 }
    }
  })
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
