import { TaskPolicy, AuthenticatedRequest } from '../../../shared';
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
export declare class TaskResponseDto {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    project_id: string;
    assigned_to: string | null;
    due_date: string | null;
    completed_at: string | null;
    notes: string | null;
    is_completed: boolean;
    is_overdue: boolean;
    created_at: string;
    updated_at: string;
}
export declare class TaskListResponseDto {
    success: boolean;
    data: TaskResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}
export declare class TaskCreateResponseDto {
    success: boolean;
    message: string;
    data: TaskResponseDto;
}
export declare class TaskStatsResponseDto {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    in_progress_tasks: number;
    overdue_tasks: number;
    completion_rate: number;
}
export declare class MessageResponseDto {
    message: string;
}
export declare class ErrorResponseDto {
    statusCode: number;
    error: string;
    message: string;
}
export declare class TaskController {
    private readonly createTaskUseCase;
    private readonly taskPolicy;
    private readonly taskRepository;
    private readonly userRepository;
    constructor(createTaskUseCase: CreateTaskUseCase, taskPolicy: TaskPolicy, taskRepository: TaskRepository, userRepository: UserRepository);
    index(req: AuthenticatedRequest, page?: string, perPage?: string, projectId?: string, status?: TaskStatus, priority?: TaskPriority, assignedTo?: string, overdue?: string, search?: string): Promise<{
        success: boolean;
        data: TaskResource[];
        pagination: any;
    }>;
    store(createTaskDto: CreateTaskDto, req: AuthenticatedRequest): Promise<{
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
