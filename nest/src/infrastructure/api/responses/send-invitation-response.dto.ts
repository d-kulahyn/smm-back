import { ApiProperty } from '@nestjs/swagger';
import { ProjectInvitationResponseDto } from './project-invitation-response.dto';

export class SendInvitationResponseDto {
  @ApiProperty({ example: 'Invitation sent successfully' })
  message: string;

  @ApiProperty({ type: ProjectInvitationResponseDto })
  invitation: ProjectInvitationResponseDto;

  @ApiProperty({ example: true, description: 'Whether email was sent' })
  emailSent: boolean;
}
