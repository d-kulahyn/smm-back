import { ProjectRole } from '@prisma/client';
export declare class SendProjectInvitationDto {
    email?: string;
    role: ProjectRole;
    permissions?: string[];
}
