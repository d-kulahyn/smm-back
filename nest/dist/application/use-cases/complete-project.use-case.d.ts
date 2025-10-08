import { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';
export declare class CompleteProjectUseCase {
    private readonly projectRepository;
    constructor(projectRepository: ProjectRepository);
    execute(projectId: string, userId: string): Promise<Project>;
}
