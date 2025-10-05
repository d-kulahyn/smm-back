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
exports.PrismaTaskRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const task_entity_1 = require("../../domain/entities/task.entity");
let PrismaTaskRepository = class PrismaTaskRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                assignments: true
            }
        });
        return task ? this.toDomain(task) : null;
    }
    async findByProjectId(projectId) {
        const tasks = await this.prisma.task.findMany({
            where: { projectId },
            include: {
                assignments: true
            }
        });
        return tasks.map(this.toDomain);
    }
    async findByCreatorId(creatorId) {
        const tasks = await this.prisma.task.findMany({
            where: { creatorId },
            include: {
                assignments: true
            }
        });
        return tasks.map(this.toDomain);
    }
    async findByCreatorIdPaginated(creatorId, page, perPage, filters) {
        const skip = (page - 1) * perPage;
        const where = { creatorId };
        if (filters) {
            if (filters.projectId)
                where.projectId = filters.projectId;
            if (filters.status)
                where.status = filters.status;
            if (filters.priority)
                where.priority = filters.priority;
            if (filters.overdue) {
                where.dueDate = {
                    lt: new Date()
                };
                where.status = {
                    not: 'completed'
                };
            }
            if (filters.search) {
                where.OR = [
                    { title: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } }
                ];
            }
            if (filters.assignedTo) {
                where.assignments = {
                    some: {
                        userId: filters.assignedTo
                    }
                };
            }
        }
        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                include: {
                    assignments: true
                },
                skip,
                take: perPage,
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.task.count({ where })
        ]);
        return {
            data: tasks.map(this.toDomain),
            meta: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        };
    }
    async findByAssignedTo(assignedTo, page, perPage) {
        const skip = (page - 1) * perPage;
        const where = {
            assignments: {
                some: {
                    userId: assignedTo
                }
            }
        };
        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                include: {
                    assignments: true
                },
                skip,
                take: perPage,
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.task.count({ where })
        ]);
        return {
            data: tasks.map(this.toDomain),
            meta: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        };
    }
    async findOverdueByUserId(userId) {
        const tasks = await this.prisma.task.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    {
                        assignments: {
                            some: {
                                userId: userId
                            }
                        }
                    }
                ],
                dueDate: {
                    lt: new Date()
                },
                status: {
                    not: 'completed'
                }
            },
            include: {
                assignments: true
            }
        });
        return tasks.map(this.toDomain);
    }
    async getUserTaskStatistics(userId) {
        const where = {
            OR: [
                { creatorId: userId },
                {
                    assignments: {
                        some: {
                            userId: userId
                        }
                    }
                }
            ]
        };
        const [total, completed, pending, inProgress, overdue] = await Promise.all([
            this.prisma.task.count({ where }),
            this.prisma.task.count({
                where: {
                    ...where,
                    status: 'completed'
                }
            }),
            this.prisma.task.count({
                where: {
                    ...where,
                    status: 'pending'
                }
            }),
            this.prisma.task.count({
                where: {
                    ...where,
                    status: 'on_hold'
                }
            }),
            this.prisma.task.count({
                where: {
                    ...where,
                    dueDate: {
                        lt: new Date()
                    },
                    status: {
                        not: 'completed'
                    }
                }
            })
        ]);
        return {
            total,
            completed,
            pending,
            inProgress: inProgress,
            overdue
        };
    }
    async create(task) {
        const taskData = {
            id: task.id,
            title: task.title,
            description: task.description,
            projectId: task.projectId,
            creatorId: task.creatorId,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            completedAt: task.completedAt,
        };
        if (taskData.description !== undefined) {
            taskData.description = taskData.description;
        }
        if (taskData.dueDate !== undefined) {
            taskData.dueDate = taskData.dueDate;
        }
        if (taskData.completedAt !== undefined) {
            taskData.completedAt = taskData.completedAt;
        }
        const created = await this.prisma.task.create({
            data: taskData,
        });
        if (task.assignedTo) {
            await this.prisma.taskAssignment.create({
                data: {
                    taskId: created.id,
                    userId: task.assignedTo,
                },
            });
        }
        return this.toDomain(created);
    }
    async update(id, taskData) {
        const updated = await this.prisma.task.update({
            where: { id },
            data: {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
                dueDate: taskData.dueDate,
            },
            include: {
                assignments: true
            }
        });
        if (taskData.assignedTo !== undefined) {
            await this.prisma.taskAssignment.deleteMany({
                where: { taskId: id }
            });
            if (taskData.assignedTo) {
                await this.prisma.taskAssignment.create({
                    data: {
                        taskId: id,
                        userId: taskData.assignedTo
                    }
                });
            }
        }
        return this.toDomain(updated);
    }
    async delete(id) {
        await this.prisma.task.delete({
            where: { id },
        });
    }
    toDomain(task) {
        const assignedTo = task.assignments && task.assignments.length > 0
            ? task.assignments[0].userId
            : undefined;
        return new task_entity_1.Task(task.id, task.title, task.projectId, task.creatorId, task.description, task.status, task.priority, assignedTo, task.completedAt, task.dueDate, task.createdAt, task.updatedAt);
    }
};
exports.PrismaTaskRepository = PrismaTaskRepository;
exports.PrismaTaskRepository = PrismaTaskRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaTaskRepository);
//# sourceMappingURL=prisma-task.repository.js.map