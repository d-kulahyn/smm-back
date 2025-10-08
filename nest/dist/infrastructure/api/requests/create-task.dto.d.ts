import { TaskPriority, TaskStatus } from '../../../../domain/enums/index';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    project_id: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string;
    assignedTo?: string;
    notes?: string;
    reminderBeforeHours?: number;
}
