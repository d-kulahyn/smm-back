import { ProjectPolicy } from '../../../shared';
import { AuthenticatedRequest } from '../../../shared';
import { CreateProjectUseCase } from '../../../application/use-cases/create-project.use-case';
import { CompleteProjectUseCase } from '../../../application/use-cases/complete-project.use-case';
import { GetProjectStatsUseCase } from '../../../application/use-cases/get-project-stats.use-case';
import { ProjectRepository } from '../../../domain/repositories/project.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { ProjectResource } from '../resources/project-resource.dto';
import { FileService } from '../../../shared';
import { CreateProjectDto, UpdateProjectDto } from '../requests';
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
    complete(id: string, req: AuthenticatedRequest): Promise<ProjectResource>;
    putOnHold(id: string, req: AuthenticatedRequest): Promise<ProjectResource>;
    cancel(id: string, req: AuthenticatedRequest): Promise<ProjectResource>;
    archive(id: string, req: AuthenticatedRequest): Promise<ProjectResource>;
}
