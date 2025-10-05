import { ProjectPolicy } from '../../../shared';
import { AuthenticatedRequest } from '../../../shared';
import { CreateProjectUseCase } from '../../../application/use-cases/create-project.use-case';
import { CompleteProjectUseCase } from '../../../application/use-cases/complete-project.use-case';
import { GetProjectStatsUseCase } from '../../../application/use-cases/get-project-stats.use-case';
import { ProjectRepository } from '../../../domain/repositories/project.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { ProjectStatus } from '../../../domain/enums/project-status.enum';
import { ProjectResource } from '../resources/project-resource.dto';
import { FileService } from '../../../shared';
export declare class ProjectResponseDto {
    id: string;
    name: string;
    description: string | null;
    status: string;
    ownerId: string;
    startDate: string | null;
    endDate: string | null;
    budget: number | null;
    avatar: string | null;
    color: string | null;
    createdAt: string;
    updatedAt: string;
}
export declare class ProjectListResponseDto {
    success: boolean;
    data: ProjectResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export declare class ProjectCreateResponseDto {
    success: boolean;
    message: string;
    data: ProjectResponseDto;
}
export declare class ProjectStatsResponseDto {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    onHoldProjects: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
}
export declare class MessageResponseDto {
    message: string;
}
export declare class ErrorResponseDto {
    statusCode: number;
    error: string;
    message: string;
}
export declare class CreateProjectDto {
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate?: string;
    endDate?: string;
    budget?: number;
    color?: string;
    avatar?: any;
}
export declare class UpdateProjectDto {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: string;
    endDate?: string;
    budget?: number;
    color?: string;
}
export declare class ProjectController {
    private readonly createProjectUseCase;
    private readonly completeProjectUseCase;
    private readonly getProjectStatsUseCase;
    private readonly fileService;
    private readonly projectPolicy;
    private readonly projectRepository;
    private readonly userRepository;
    constructor(createProjectUseCase: CreateProjectUseCase, completeProjectUseCase: CompleteProjectUseCase, getProjectStatsUseCase: GetProjectStatsUseCase, fileService: FileService, projectPolicy: ProjectPolicy, projectRepository: ProjectRepository, userRepository: UserRepository);
    index(req: AuthenticatedRequest, page?: string, perPage?: string): Promise<{
        success: boolean;
        data: ProjectResource[];
        meta: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    store(createProjectDto: CreateProjectDto, req: AuthenticatedRequest, avatar?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: ProjectResource;
    }>;
    show(id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: ProjectResource;
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: ProjectResource;
    }>;
    destroy(id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    complete(id: string): Promise<ProjectResource>;
    putOnHold(id: string): Promise<ProjectResource>;
    cancel(id: string): Promise<ProjectResource>;
    archive(id: string): Promise<ProjectResource>;
}
