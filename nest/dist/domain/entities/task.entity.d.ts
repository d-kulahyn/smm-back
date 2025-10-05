import { TaskStatus, TaskPriority } from '../enums';
export declare class Task {
    readonly id: string;
    readonly title: string;
    readonly projectId: string;
    readonly creatorId: string;
    readonly description?: string;
    readonly status: TaskStatus;
    readonly priority: TaskPriority;
    readonly assignedTo?: string;
    readonly completedAt?: Date;
    readonly dueDate?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, title: string, projectId: string, creatorId: string, description?: string, status?: TaskStatus, priority?: TaskPriority, assignedTo?: string, completedAt?: Date, dueDate?: Date, createdAt?: Date, updatedAt?: Date);
    complete(): Task;
    startProgress(): Task;
    isCompleted(): boolean;
    isOverdue(): boolean;
}
