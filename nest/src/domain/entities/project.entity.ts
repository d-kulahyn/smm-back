import { ProjectStatus } from '../enums/project-status.enum';

export interface ProjectStatsDto {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
}

export class Project {
  public statsDto?: ProjectStatsDto;
  public tasks: any[] = [];
  public members: any[] = [];
  public invitations: any[] = [];
  public chats: any[] = [];

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly ownerId: string,
    public readonly description?: string,
    public readonly status: ProjectStatus = ProjectStatus.ACTIVE,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly budget?: number,
    public readonly avatar?: string,
    public readonly color?: string,
    public readonly metadata?: any,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  setStats(statsDto: ProjectStatsDto): this {
    this.statsDto = statsDto;
    return this;
  }

  setTasks(tasks: any[]): this {
    this.tasks = tasks;
    return this;
  }

  setMembers(members: any[]): this {
    this.members = members;
    return this;
  }

  setInvitations(invitations: any[]): this {
    this.invitations = invitations;
    return this;
  }

  setChats(chats: any[]): this {
    this.chats = chats;
    return this;
  }

  complete(): Project {
    return new Project(
      this.id,
      this.name,
      this.ownerId,
      this.description,
      ProjectStatus.COMPLETED,
      this.startDate,
      this.endDate,
      this.budget,
      this.avatar,
      this.color,
      this.metadata,
      this.createdAt,
      new Date(),
    );
  }

  putOnHold(): Project {
    return new Project(
      this.id,
      this.name,
      this.ownerId,
      this.description,
      ProjectStatus.ON_HOLD,
      this.startDate,
      this.endDate,
      this.budget,
      this.avatar,
      this.color,
      this.metadata,
      this.createdAt,
      new Date(),
    );
  }

  cancel(): Project {
    return new Project(
      this.id,
      this.name,
      this.ownerId,
      this.description,
      ProjectStatus.CANCELLED,
      this.startDate,
      this.endDate,
      this.budget,
      this.avatar,
      this.color,
      this.metadata,
      this.createdAt,
      new Date(),
    );
  }

  archive(): Project {
    return new Project(
      this.id,
      this.name,
      this.ownerId,
      this.description,
      ProjectStatus.ARCHIVED,
      this.startDate,
      this.endDate,
      this.budget,
      this.avatar,
      this.color,
      this.metadata,
      this.createdAt,
      new Date(),
    );
  }

  isCompleted(): boolean {
    return this.status === ProjectStatus.COMPLETED;
  }

  isActive(): boolean {
    return this.status === ProjectStatus.ACTIVE;
  }

  isOnHold(): boolean {
    return this.status === ProjectStatus.ON_HOLD;
  }

  isCancelled(): boolean {
    return this.status === ProjectStatus.CANCELLED;
  }

  getBudgetFormatted(): string {
    return this.budget ? `$${this.budget.toFixed(2)}` : 'No budget set';
  }

  getDuration(): number | null {
    if (!this.startDate || !this.endDate) return null;
    return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
  }
}
