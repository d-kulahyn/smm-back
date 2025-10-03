import { PrismaService } from '../../infrastructure/database/prisma.service';
export interface ProjectStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
}
export declare class GetProjectStatsUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(projectIds: string[]): Promise<Map<string, ProjectStats>>;
    getForSingleProject(projectId: string): Promise<ProjectStats>;
}
