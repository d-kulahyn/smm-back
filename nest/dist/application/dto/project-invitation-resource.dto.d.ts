import { FormattedDate } from '../../shared/formatters/date.formatter';
import { UserResource } from './project-member-resource.dto';
export declare class ProjectInvitationResource {
    id: string;
    projectId: string;
    userId: string;
    status: string;
    createdAt: FormattedDate;
    updatedAt: FormattedDate;
    user?: UserResource;
    constructor(invitation: any);
    static fromEntity(invitation: any): ProjectInvitationResource;
    static collection(invitations: any[]): ProjectInvitationResource[];
}
