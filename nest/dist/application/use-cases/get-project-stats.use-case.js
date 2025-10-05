"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProjectStatsUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let GetProjectStatsUseCase = class GetProjectStatsUseCase {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(projectIds) {
        if (projectIds.length === 0) {
            return new Map();
        }
        const detailedStats = await this.prisma.$queryRaw `
            SELECT "projectId",
                   COUNT(*)                                                                     as total_tasks,
                   SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)                      as completed_tasks,
                   SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)                        as pending_tasks,
                   SUM(CASE WHEN "dueDate" < NOW() AND status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
            FROM tasks
            WHERE "projectId" = ANY (${projectIds})
            GROUP BY "projectId"
        `;
        const statsMap = new Map();
        detailedStats.forEach((stat) => {
            statsMap.set(stat.projectId, {
                totalTasks: parseInt(stat.total_tasks) || 0,
                completedTasks: parseInt(stat.completed_tasks) || 0,
                pendingTasks: parseInt(stat.pending_tasks) || 0,
                overdueTasks: parseInt(stat.overdue_tasks) || 0,
            });
        });
        return statsMap;
    }
    async getForSingleProject(projectId) {
        const statsMap = await this.execute([projectId]);
        return statsMap.get(projectId) || {
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            overdueTasks: 0,
        };
    }
};
exports.GetProjectStatsUseCase = GetProjectStatsUseCase;
exports.GetProjectStatsUseCase = GetProjectStatsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GetProjectStatsUseCase);
//# sourceMappingURL=get-project-stats.use-case.js.map