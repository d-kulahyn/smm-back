import { Project } from '../entities/project.entity';
import { PaginatedResult } from '../../shared/interfaces/pagination.interface';
export interface ProjectRepository {
    findById(id: string, userId: string): Promise<Project | null>;
    findByOwnerId(ownerId: string): Promise<Project[]>;
    findByMemberId(userId: string): Promise<Project[]>;
    findByUserIdPaginated(userId: string, page: number, perPage: number): Promise<PaginatedResult<Project>>;
    create(project: Project): Promise<Project>;
    update(id: string, project: Partial<Project>): Promise<Project>;
    delete(id: string): Promise<void>;
}
