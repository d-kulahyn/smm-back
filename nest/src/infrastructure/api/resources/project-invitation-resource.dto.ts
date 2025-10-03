import { DateFormatter, FormattedDate } from '../../../shared/formatters/date.formatter';
import { UserResource } from './project-member-resource.dto';

export class ProjectInvitationResource {
  id: string;
  projectId: string;
  userId: string;
  status: string;
  createdAt: FormattedDate;
  updatedAt: FormattedDate;
  user?: UserResource;

  constructor(invitation: any) {
    this.id = invitation.id;
    this.projectId = invitation.projectId;
    this.userId = invitation.userId;
    this.status = invitation.status;
    this.createdAt = DateFormatter.formatCreatedAt(invitation.createdAt);
    this.updatedAt = DateFormatter.formatUpdatedAt(invitation.updatedAt);

    if (invitation.user) {
      this.user = {
        id: invitation.user.id,
        name: invitation.user.name,
        email: invitation.user.email,
        avatar: invitation.user.avatar ? `/storage/${invitation.user.avatar}` : undefined,
      };
    }
  }

  static fromEntity(invitation: any): ProjectInvitationResource {
    return new ProjectInvitationResource(invitation);
  }

  static collection(invitations: any[]): ProjectInvitationResource[] {
    return invitations.map(invitation => new ProjectInvitationResource(invitation));
  }
}
