import { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/enums/project-status.enum';
export interface CreateProjectCommand {
    name: string;
    description?: string;
    ownerId: string;
    status?: ProjectStatus;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    avatar?: string;
    color?: string;
    metadata?: any;
}
export declare class CreateProjectUseCase {
    private readonly projectRepository;
    constructor(projectRepository: ProjectRepository);
    execute(command: CreateProjectCommand): Promise<Project>;
}
