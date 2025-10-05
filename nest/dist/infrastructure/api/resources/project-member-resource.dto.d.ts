import { FormattedDate } from '../../../shared/formatters/date.formatter';
export interface UserResource {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}
export declare class ProjectMemberResource {
    id: string;
    projectId: string;
    userId: string;
    role: string;
    permissions?: any;
    joinedAt: FormattedDate;
    user?: UserResource;
    constructor(member: any);
    static fromEntity(member: any): ProjectMemberResource;
    static collection(members: any[]): ProjectMemberResource[];
}
