import { Project, ProjectStatsDto } from '../../../domain/entities/project.entity';
import { DateFormatter, FormattedDate } from '../../../shared/formatters/date.formatter';
import { TaskResource } from './task-resource.dto';
import { ProjectMemberResource } from './project-member-resource.dto';
import { ProjectInvitationResource } from './project-invitation-resource.dto';
import { ChatResource } from './chat-resource.dto';

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export class ProjectResource {
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

  // Связанные данные используют отдельные ресурсы
  tasks: TaskResource[];
  members: ProjectMemberResource[];
  invitations: ProjectInvitationResource[];
  chats: ChatResource[];

  constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.status = project.status;
    this.customer_id = project.ownerId;
    this.start_date = DateFormatter.formatDate(project.startDate);
    this.end_date = DateFormatter.formatDate(project.endDate);
    this.budget = project.budget;
    this.metadata = project.metadata;
    this.is_active = project.isActive();
    this.is_completed = project.isCompleted();
    this.stats = project.statsDto;
    this.avatar = project.avatar ? `/storage/${project.avatar}` : null;
    this.color = project.color;
    this.created_at = DateFormatter.formatCreatedAt(project.createdAt);
    this.updated_at = DateFormatter.formatUpdatedAt(project.updatedAt);

    // Используем отдельные ресурсы для связанных данных
    this.tasks = project.tasks ? TaskResource.collection(project.tasks) : [];
    this.members = project.members ? ProjectMemberResource.collection(project.members) : [];
    this.invitations = project.invitations ? ProjectInvitationResource.collection(project.invitations) : [];
    this.chats = project.chats ? ChatResource.collection(project.chats) : [];
  }

  static fromEntity(project: Project): ProjectResource {
    return new ProjectResource(project);
  }

  static collection(projects: Project[]): ProjectResource[] {
    return projects.map(project => new ProjectResource(project));
  }
}
