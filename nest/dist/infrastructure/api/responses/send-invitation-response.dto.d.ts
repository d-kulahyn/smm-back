import { ProjectInvitationResponseDto } from './project-invitation-response.dto';
export declare class SendInvitationResponseDto {
    message: string;
    invitation: ProjectInvitationResponseDto;
    emailSent: boolean;
}
