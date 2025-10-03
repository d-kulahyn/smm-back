import { ProjectStatus } from '../enums/project-status.enum';
export interface ProjectStatsDto {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
}
export declare class Project {
    readonly id: string;
    readonly name: string;
    readonly ownerId: string;
    readonly description?: string;
    readonly status: ProjectStatus;
    readonly startDate?: Date;
    readonly endDate?: Date;
    readonly budget?: number;
    readonly avatar?: string;
    readonly color?: string;
    readonly metadata?: any;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    statsDto?: ProjectStatsDto;
    tasks: any[];
    members: any[];
    invitations: any[];
    chats: any[];
    constructor(id: string, name: string, ownerId: string, description?: string, status?: ProjectStatus, startDate?: Date, endDate?: Date, budget?: number, avatar?: string, color?: string, metadata?: any, createdAt?: Date, updatedAt?: Date);
    setStats(statsDto: ProjectStatsDto): this;
    setTasks(tasks: any[]): this;
    setMembers(members: any[]): this;
    setInvitations(invitations: any[]): this;
    setChats(chats: any[]): this;
    complete(): Project;
    putOnHold(): Project;
    cancel(): Project;
    archive(): Project;
    isCompleted(): boolean;
    isActive(): boolean;
    isOnHold(): boolean;
    isCancelled(): boolean;
    getBudgetFormatted(): string;
    getDuration(): number | null;
}
