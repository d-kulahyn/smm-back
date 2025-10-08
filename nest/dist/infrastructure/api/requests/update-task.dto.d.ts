import { TaskPriority, TaskStatus } from '../../../../domain/enums/index';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string;
    assignedTo?: string;
    notes?: string;
}
