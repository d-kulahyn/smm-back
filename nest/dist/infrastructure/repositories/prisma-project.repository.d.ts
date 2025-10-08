import { PrismaService } from '../database/prisma.service';
import { ChatRepository } from '../../domain/repositories/chat.repository';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';
import { PaginatedResult } from '../../shared/interfaces/pagination.interface';
export declare class PrismaProjectRepository implements ProjectRepository {
    private readonly prisma;
    private readonly chatRepository;
    constructor(prisma: PrismaService, chatRepository: ChatRepository);
    findById(id: string, userId: string): Promise<Project | null>;
    findByOwnerId(ownerId: string): Promise<Project[]>;
    findByMemberId(userId: string): Promise<Project[]>;
    create(project: Project): Promise<Project>;
    update(id: string, projectData: Partial<Project>): Promise<Project>;
    delete(id: string): Promise<void>;
    findByUserIdPaginated(userId: string, page: number, perPage: number): Promise<PaginatedResult<Project>>;
    private getProjectChats;
    private getProjectChatsMap;
    private getProjectChatsMapWithExtras;
    private toDomainWithRelations;
    private toDomainWithRelationsWithExtras;
    private toDomain;
}
