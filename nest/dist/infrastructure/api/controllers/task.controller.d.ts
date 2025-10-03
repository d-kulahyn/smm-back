import { TaskPolicy, AuthenticatedRequest, FileService } from '../../../shared';
import { CreateTaskUseCase } from '../../../application/use-cases/create-task.use-case';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { TaskPriority, TaskStatus } from '../../../domain/enums';
import { TaskResource } from '../resources/task-resource.dto';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    project_id: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string;
    assignedTo?: string;
    notes?: string;
    attachments?: any[];
    reminderBeforeHours?: number;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string;
    assignedTo?: string;
    notes?: string;
}
export declare class CreateTaskReminderDto {
    remindAt: string;
    message?: string;
}
export declare class TaskController {
    private readonly createTaskUseCase;
    private readonly fileService;
    private readonly taskPolicy;
    private readonly taskRepository;
    private readonly userRepository;
    constructor(createTaskUseCase: CreateTaskUseCase, fileService: FileService, taskPolicy: TaskPolicy, taskRepository: TaskRepository, userRepository: UserRepository);
    index(req: AuthenticatedRequest, page?: string, perPage?: string, projectId?: string, status?: TaskStatus, priority?: TaskPriority, assignedTo?: string, overdue?: string, search?: string): Promise<{
        success: boolean;
        data: TaskResource[];
        pagination: any;
    }>;
    store(createTaskDto: CreateTaskDto, req: AuthenticatedRequest, attachments?: Express.Multer.File[]): Promise<{
        success: boolean;
        message: string;
        data: TaskResource;
    }>;
    show(id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: TaskResource;
    }>;
    update(id: string, updateTaskDto: UpdateTaskDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: TaskResource;
    }>;
    destroy(id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    changeStatus(id: string, body: {
        status: TaskStatus;
    }, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: TaskResource;
    }>;
    assign(id: string, userId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: TaskResource;
    }>;
    addAttachment(id: string, req: AuthenticatedRequest, attachment: Express.Multer.File): Promise<{
        message: string;
        attachment: {
            originalName: string;
            downloadUrl: string;
        };
    }>;
    removeAttachment(taskId: string, attachmentId: string): Promise<{
        message: string;
    }>;
    createReminder(taskId: string, body: {
        hours_before: number;
        message?: string;
    }, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            taskId: string;
            remindAt: string;
            message: string;
            hours_before: number;
        };
    }>;
    getOverdueTasks(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: TaskResource[];
        meta: {
            total: number;
            overdue_count: number;
        };
    }>;
    getAssignedToMe(req: AuthenticatedRequest, page?: string, perPage?: string): Promise<{
        success: boolean;
        data: TaskResource[];
        pagination: any;
    }>;
    getStatistics(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: {
            total_tasks: any;
            completed_tasks: any;
            pending_tasks: any;
            in_progress_tasks: any;
            overdue_tasks: any;
            completion_rate: number;
        };
    }>;
    changePriority(id: string, body: {
        priority: TaskPriority;
    }, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: TaskResource;
    }>;
}
