import { Task } from '../entities/task.entity';
export interface TaskRepository {
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
    update(id: string, task: Partial<Task>): Promise<Task>;
    delete(id: string): Promise<void>;
}
