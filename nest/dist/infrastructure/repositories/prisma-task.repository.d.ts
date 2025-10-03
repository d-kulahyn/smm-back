import { PrismaService } from '../database/prisma.service';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
export declare class PrismaTaskRepository implements TaskRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<Task | null>;
    findByProjectId(projectId: string): Promise<Task[]>;
    findByCreatorId(creatorId: string): Promise<Task[]>;
    findByCreatorIdPaginated(creatorId: string, page: number, perPage: number, filters?: any): Promise<{
        data: Task[];
        meta: any;
    }>;
    findByAssignedTo(assignedTo: string, page: number, perPage: number): Promise<{
        data: Task[];
        meta: any;
    }>;
    findOverdueByUserId(userId: string): Promise<Task[]>;
    getUserTaskStatistics(userId: string): Promise<any>;
    create(task: Task): Promise<Task>;
    update(id: string, taskData: Partial<Task>): Promise<Task>;
    delete(id: string): Promise<void>;
    private toDomain;
}
