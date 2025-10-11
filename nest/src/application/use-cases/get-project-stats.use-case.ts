import {Injectable, Inject} from '@nestjs/common';
import {PrismaService} from '../../infrastructure/database/prisma.service';

export interface ProjectStats {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
}

@Injectable()
export class GetProjectStatsUseCase {
    constructor(private readonly prisma: PrismaService) {
    }

    async execute(projectIds: string[]): Promise<Map<string, ProjectStats>> {
        if (projectIds.length === 0) {
            return new Map();
        }

        const detailedStats = await this.prisma.$queryRaw<any[]>`
            SELECT "projectId",
                   COUNT(*)                                                                     as total_tasks,
                   SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)                      as completed_tasks,
                   SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)                        as pending_tasks,
                   SUM(CASE WHEN "dueDate" < NOW() AND status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
            FROM tasks
            WHERE "projectId" = ANY (${projectIds})
            GROUP BY "projectId"
        `;

        const statsMap = new Map<string, ProjectStats>();

        detailedStats.forEach((stat: any) => {
            statsMap.set(stat.projectId, {
                total_tasks: parseInt(stat.total_tasks) || 0,
                completed_tasks: parseInt(stat.completed_tasks) || 0,
                pending_tasks: parseInt(stat.pending_tasks) || 0,
                overdue_tasks: parseInt(stat.overdue_tasks) || 0,
            });
        });

        return statsMap;
    }

    async getForSingleProject(projectId: string): Promise<ProjectStats> {
        const statsMap = await this.execute([projectId]);
        return statsMap.get(projectId) || {
            total_tasks: 0,
            completed_tasks: 0,
            pending_tasks: 0,
            overdue_tasks: 0,
        };
    }
}
