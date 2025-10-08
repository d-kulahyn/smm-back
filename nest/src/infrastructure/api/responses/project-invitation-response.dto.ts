import { ApiProperty } from '@nestjs/swagger';

export class ProjectInvitationResponseDto {
  @ApiProperty({ example: 'clm1invite123def456' })
  id: string;

  @ApiProperty({ example: 'abc123token456' })
  token: string;

  @ApiProperty({ example: 'clm1project123456' })
  projectId: string;

  @ApiProperty({ example: 'user@example.com' })
  invitedEmail: string;

  @ApiProperty({ example: 'member' })
  role: string;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  permissions: string[];

  @ApiProperty({ example: '2024-12-31T23:59:59.000Z' })
  expiresAt: string;
}
