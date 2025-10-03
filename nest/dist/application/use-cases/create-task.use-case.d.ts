import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskPriority, TaskStatus } from '../../domain/enums';
export interface CreateTaskCommand {
    title: string;
    description?: string;
    projectId: string;
    creatorId: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    attachments?: string[];
    dueDate?: Date;
    assignedTo?: string;
    notes?: string;
    reminderBeforeHours?: number;
}
export declare class CreateTaskUseCase {
    private readonly taskRepository;
    constructor(taskRepository: TaskRepository);
    execute(command: CreateTaskCommand): Promise<Task>;
}
