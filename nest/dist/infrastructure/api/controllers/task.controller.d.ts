import { TaskPolicy, AuthenticatedRequest } from '../../../shared';
import { CreateTaskUseCase } from '../../../application/use-cases/create-task.use-case';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { TaskPriority, TaskStatus } from '../../../domain/enums';
import { TaskResource } from '../resources/task-resource.dto';
import { CreateTaskDto, UpdateTaskDto } from '../requests';
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
