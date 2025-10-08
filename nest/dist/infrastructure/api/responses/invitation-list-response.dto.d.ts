import { ProjectInvitationResponseDto } from './project-invitation-response.dto';
export declare class InvitationListResponseDto {
    data: ProjectInvitationResponseDto[];
    pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
}
