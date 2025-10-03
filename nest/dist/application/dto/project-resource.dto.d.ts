import { Project, ProjectStatsDto } from '../../domain/entities/project.entity';
import { FormattedDate } from '../../shared/formatters/date.formatter';
import { TaskResource } from './task-resource.dto';
import { ProjectMemberResource } from './project-member-resource.dto';
import { ProjectInvitationResource } from '../../infrastructure/api/resources/project-invitation-resource.dto';
import { ChatResource } from '../../infrastructure/api/resources/chat-resource.dto';
export interface ProjectStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
}
export declare class ProjectResource {
    id: string;
    name: string;
    description?: string;
    status: string;
    customer_id: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
    metadata?: any;
    is_active: boolean;
    is_completed: boolean;
    stats?: ProjectStatsDto;
    avatar?: string;
    color?: string;
    created_at: FormattedDate;
    updated_at: FormattedDate;
    tasks: TaskResource[];
    members: ProjectMemberResource[];
    invitations: ProjectInvitationResource[];
    chats: ChatResource[];
    constructor(project: Project);
    static fromEntity(project: Project): ProjectResource;
    static collection(projects: Project[]): ProjectResource[];
}
