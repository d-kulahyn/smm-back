import { DateFormatter, FormattedDate } from '../../../shared/formatters/date.formatter';

export interface UserResource {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export class ProjectMemberResource {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  permissions?: any;
  joinedAt: FormattedDate;
  user?: UserResource;

  constructor(member: any) {
    this.id = member.id;
    this.projectId = member.projectId;
    this.userId = member.userId;
    this.role = member.role;
    this.permissions = member.permissions;
    this.joinedAt = DateFormatter.formatCreatedAt(member.joinedAt);

    if (member.user) {
      this.user = {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar ? `/storage/${member.user.avatar}` : undefined,
      };
    }
  }

  static fromEntity(member: any): ProjectMemberResource {
    return new ProjectMemberResource(member);
  }

  static collection(members: any[]): ProjectMemberResource[] {
    return members.map(member => new ProjectMemberResource(member));
  }
}
