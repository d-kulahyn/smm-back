import { ProjectRole } from '@prisma/client';
export declare class SendProjectInvitationDto {
    email?: string;
    role: ProjectRole;
    permissions?: string[];
}
export declare class SendProjectInvitationUseCaseDto {
    projectId: string;
    invitedBy: string;
    invitedEmail?: string;
    role: ProjectRole;
    permissions?: string[];
}
export declare class AcceptProjectInvitationUseCaseDto {
    token: string;
    userId: string;
}
export declare class PaginationDto {
    page?: number;
    perPage?: number;
}
